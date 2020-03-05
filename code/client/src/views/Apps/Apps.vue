<template>
  <!--article-list-lay layout-content start-->
  <section class="subscribe-lay layout-content"
           id="subscribe-lay">
    <div class="container box-container client-card">
      <nav class="switch-list-nav">
        <ul class="nav-item-view">
          <li class="nav-item"
              v-for="column_item in articleColumn.homeColumn"
              :key="column_item.column_id">
            <router-link :to="{name:'books',params:{columnEnName:column_item.en_name}}">
              {{column_item.name}}
            </router-link>
          </li>
          <li class="nav-item more">
            <router-link :to="{name:'columnAll'}"> 更多...</router-link>
          </li>
        </ul>
      </nav>

      <div class="menu-main">
        <nav class="column-tag-menu"
             v-if="childNavItem.tag&&childNavItem.tag.length>0">
          <ul class="nav-item-view">
            <li class="nav-item"
                v-for="(item,key) in childNavItem.tag"
                :key="key"
                :class="{'active':item.tag_id===$route.query.tagId}">
              <router-link :to="{name:'books',query:{tagId:item.tag_id}}">
                {{item.name}}
              </router-link>
            </li>
          </ul>
        </nav>

        <nav class="sort-list-menu clearfix">
          <router-link class="nav-item"
                       :to="{name:'books',query:sortMenu('')}">热门</router-link>
          <router-link class="nav-item"
                       :to="{name:'books',query:sortMenu('new')}">最新</router-link>
          <router-link class="nav-item"
                       :to="{name:'books',query:sortMenu('30day')}">近30天</router-link>
          <router-link class="nav-item"
                       :to="{name:'books',query:sortMenu('7day')}">近7天</router-link>
          <span class="nav-item add-book"
                @click="createBook">新增APP</span>
        </nav>
      </div>

      <div class="row tag-list">
        <div class="item col-xs-12 col-sm-3 col-md-3"
             v-for="(item,key) in apps.appsList.list"
             :key="key">
          <AppItem :articleTagItem="item" />
        </div>
      </div>

      <Page :total="Number(apps.appsList.total)"
            :pageSize="Number(apps.appsList.pageSize)"
            :page="Number($route.query.page)||1"
            @pageChange="pageChange"></Page>
    </div>
  </section>
  <!--article-list-lay layout-content end-->
</template>

<script>
    import { share, baidu, google } from '@utils'
    import { mapState } from 'vuex'
    import { Page } from "@components";
    import AppItem from '@views/Apps/component/AppItem'
    import googleMixin from '@mixins/google'
    import {
        statusList,
        articleType,
        statusListText,
        articleTypeText,
        payTypeText,
        isFree,
        isFreeText,
        modelType
    } from '@utils/constant'


    export default {
        name: "Apps",
        mixins: [googleMixin], //混合谷歌分析
        metaInfo () {
            return {
                title: `APP专区-${this.website.meta.website_name}`,
                meta: [
                    {
                        // set meta
                        name: "description",
                        content: `APP专区-${this.website.meta.website_name}`
                    }
                ],
                htmlAttrs: {
                    lang: "zh"
                },
                script: [
                    ...baidu.resource({
                        route: this.$route,
                        config: this.website.config
                    }),
                    ...google.statisticsCode({
                        route: this.$route, googleCode: this.website.config.googleCode, random: ''
                    })
                ],
                __dangerouslyDisableSanitizers: ['script']
            };
        },
        asyncData ({ store, route }) {
            // 触发 action 后，会返回 Promise
            return Promise.all([
                store.dispatch("articleColumn/GET_ARTICLE_COLUMN_ALL",{pageNum:1,pageSize:10}),
                store.dispatch('apps/GET_APPS_LIST', {
                    pageNum: route.query.page || 1,
                    // columnEnName: route.params.columnEnName || '',
                    // tagId: route.query.tagId || '',
                    // sort: route.query.sort || '',
                })
            ]);
        },
        data () {
            return {
                childNavItem: '',
                isFree,
                isFreeText,
                modelType,
                statusList,
                statusListText,
            };
        },
        created () {
            this.initColumn()
        },
        watch: {
            $route (to, from) {
                this.initColumn()
            }
        },
        methods: {
            initColumn () {
                if (this.$route.params.columnEnName && this.$route.params.columnEnName !== 'all') {
                    this.switchColumn(this.$route.params.columnEnName)
                } else {
                    this.childNavItem = {}
                }
            },
            collectBooks (books_id) { // 用户收藏小书
                this.$store.dispatch('common/SET_COLLECT', {
                    associate_id: books_id,
                    type: modelType.books
                })
                    .then(result => {
                        if (result.state === 'success') {
                            this.$message.success(result.message);
                            window.location.reload()
                        } else {
                            this.$message.warning(result.message);
                        }
                    })
            },
            createBook () {
                if (!this.$store.state.personalInfo.islogin) {
                    this.$router.push({ name: 'signIn' })
                } else {
                    this.$router.push({ name: 'appWrite', params: { type: 'create' } })
                }
            },
            isCollect (item) { // 是否收藏
                let collectUserIds = []
                if (item.collectUserIds && item.collectUserIds.length > 0) {
                    item.collectUserIds.map(item => {
                        collectUserIds.push(item.uid)
                    })
                    if (~collectUserIds.indexOf(Number(this.personalInfo.user.uid))) {
                        return {
                            status: true,
                            text: '已收藏'
                        }
                    } else {
                        return {
                            status: false,
                            text: '收藏'
                        }
                    }
                } else {
                    return {
                        status: false,
                        text: '收藏'
                    }
                }
            },
            switchColumn (val) {
                this.articleColumn.homeColumn.map(item => {
                    if (item.en_name === val) {
                        this.childNavItem = item || {}
                    }
                })
            },
            sortMenu (sort) {
                let query = {
                }
                if (sort) {
                    query.sort = sort
                }
                if (this.$route.query.tagId) {
                    query.tagId = this.$route.query.tagId
                }
                return query
            },
            shareChange (val) { // 分享到其他
                let urlOrigin = window.location.origin // 源地址
                if (val.type === 'sina') { // 新浪
                    share.shareToXl(val.data.name, urlOrigin + '/p/' + val.data.aid, this.website.meta.logo)
                } else if (val.type === 'qzone') { // qq空间
                    share.shareToQq(val.data.name, urlOrigin + '/p/' + val.data.aid, this.website.meta.logo)
                } else if (val.type === 'qq') { // qq空间
                    share.shareQQ(val.data.name, urlOrigin + '/p/' + val.data.aid, this.website.meta.logo)
                }
            },
            pageChange (val) {
                let query = {
                    page: val
                }
                if (this.$route.query.tagId) {
                    query.tagId = this.$route.query.tagId
                }
                if (this.$route.query.sort) {
                    query.sort = this.$route.query.sort
                }
                this.$router.push({
                    name: 'books',
                    params: { columnEnName: this.$route.params.columnEnName },
                    query
                })
            }
        },
        computed: {
            ...mapState(['website', 'apps', 'articleColumn', 'personalInfo'])
        },
        components: {
            AppItem,
            Page
        }
    };
</script>

<style scoped lang="scss">
.subscribe-lay.layout-content {
  .client-card {
    padding: 25px 38px;
  }
  .switch-list-nav {
    .nav-item-view {
      .nav-item {
        display: inline-block;
        margin-right: 10px;
        margin-bottom: 8px;
        a {
          display: block;
          border: 1px solid #fff;
          padding: 2px 10px;
          font-size: 14px;
          &.current-active {
            color: #fd763a;
            font-weight: bold;
            border-bottom: 1px solid #fd763a;
          }
        }
        .search-tag-from {
          position: relative;
          .search-tag-input {
            padding: 8px 10px;
            font-size: 12px;
            border: 1px solid hsla(0, 0%, 59%, 0.2);
            outline: none;
            border-radius: 5px;
          }
          .search-tag-btn {
            padding: 3px 10px;
            background: #fff;
            border: none;
            border-radius: 3px;
            position: absolute;
            right: 1px;
            top: 5px;
            outline: 0;
          }
        }
      }
    }
  }

  .menu-main {
    border-top: 1px solid rgba(178, 186, 194, 0.15);
    padding: 15px 0 0;
    border-radius: 3px;
    margin-top: 15px;
    .column-tag-menu {
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid rgba(178, 186, 194, 0.15);
      .nav-item-view {
        .nav-item {
          display: inline-block;
          margin-right: 10px;
          margin-bottom: 8px;
          a {
            display: block;
            border: 1px solid #e0e0e0;
            padding: 2px 10px;
            font-size: 14px;
            border-radius: 20px;
          }
          &.active {
            a {
              background: #fd763a;
              color: #fff;
              border: 1px solid #fd763a;
            }
          }
        }
      }
    }

    .sort-list-menu {
      display: block;
      padding-bottom: 15px;
      .nav-item {
        align-items: center;
        line-height: 1;
        position: relative;
        display: inline-block;
        font-size: 13px;
        margin-right: 15px;
        &.exact-active {
          color: #ea6f5a;
        }
      }
      .add-book {
        float: right;
        color: rgba(0, 0, 0, 0.88);
        background: #b7d6ec;
        border: 1px solid #b7d6ec;
        cursor: pointer;
        padding: 5px 12px;
        border-radius: 3px;
      }
    }
  }

  .list-header {
    padding: 0.5rem 0.4rem;
    .article-type {
      .article-blog {
        display: inline-block;
      }
      .article-tag {
        display: inline-block;
      }
    }
    .list-nav {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      justify-content: space-between;
      .nav-list {
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        line-height: 1;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: end;
        -ms-flex-pack: end;
        justify-content: flex-end;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        margin-bottom: 20px;
        .nav-item {
          position: relative;
          cursor: pointer;
          margin-right: 15px;
          a {
            padding: 5px 10px;
            font-size: 14px;
            display: block;
          }
          &.active a,
          a:hover {
            color: #ff4d4f;
            border: 1px solid #ff4d4f;
            border-radius: 15px;
          }
          .search-tag-from {
            position: relative;
            .search-tag-input {
              padding: 8px 10px;
              font-size: 12px;
              border: 1px solid hsla(0, 0%, 59%, 0.2);
              outline: none;
              border-radius: 5px;
            }
            .search-tag-btn {
              padding: 3px 10px;
              background: #fff;
              border: none;
              border-radius: 3px;
              position: absolute;
              right: 1px;
              top: 5px;
              outline: 0;
            }
          }
        }
      }
    }
  }
  .tag-list {
    .item {
      margin-bottom: 1.3rem;
      padding: 0 0.7rem;
      box-sizing: border-box;
    }
  }
}
</style>
