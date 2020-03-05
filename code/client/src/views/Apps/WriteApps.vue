<template>
  <client-only>
    <section class="books-write-lay layout-content">
      <div class="container client-card-shadow">
        <!-- this component will only be rendered on client-side -->

        <div class="row mrg-bm20 books-write-content ">
          <div class="col-xs-12 col-sm-4 col-md-3 box-form-group">
            <div class="cover-img">
              <img v-lazy="write.cover_img"
                   v-if="write.cover_img"
                   class="cover-img-view"
                   alt="">
              <div class="cover-img-view cover-img-null"
                   v-else>
                <p>封面图片为空，如果未上传，将采用默认图片</p>
              </div>
              <!--<upload-image class="upload-cover-image"-->
                            <!--@changeUpload="changeUploadCoverImg">上传封面</upload-image>-->
              <Button type="ghost" class="upload-cover-image"  @click="zh_uploadFile">选择文件</Button>
              <input type="file" ref="evfile" @change="changeUploadCoverImg" style="display:none">
            </div>
          </div>
          <div class="col-xs-12 col-sm-8 col-md-9 book-info">
            <div class="box-form-group books-name-view">
              <label class="box-label"
                     for="">APP名</label>
              <input class="box-input title"
                     v-model="write.name"
                     type="text"
                     placeholder="请输入APP名">
            </div>
            <div class="box-form-group">
              <label class="box-label"
                     for="">简介</label>
              <input class="box-input title"
                     v-model="write.description"
                     type="text"
                     placeholder="请输入APP标题"></input>
            </div>

            <div class="write mrg-bm20 box-form-group">
              <label class="box-label"
                     for="">详情</label>
              <mavon-editor v-model="write.content"
                            defaultOpen="edit"
                            :boxShadow="false"
                            :toolbars="toolbars"
                            ref="mavonEditor"
                            :imageFilter="imageFilter"
                            @imgAdd="$imgAdd" />
            </div>

            <div class="row mrg-bm20">
              <div class="col-xs-12 col-sm-6 col-md-6 box-form-group">
                <label class="box-label"
                       for="">类型</label>
                <select class="box-select"
                        v-model="write.category_id">
                  <option :value="key"
                          v-for="column_item in columnAll"
                          :key="column_item.column_id">{{column_item.name}}</option>
                </select>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 box-form-group">
                <!--<label class="box-label"-->
                       <!--for="">开启付费</label>-->
                <!--<select class="box-select"-->
                        <!--v-model="write.is_free">-->
                  <!--<option :value="key"-->
                          <!--v-for="(item,key) in isFreeText"-->
                          <!--:key="key">{{item}}</option>-->
                <!--</select>-->
              </div>
            </div>

            <!--<div class="row mrg-bm20"-->
                 <!--v-if="Number(write.is_free||1)!==isFree.free">-->
              <!--<div class="col-xs-12 col-sm-6 col-md-6 box-form-group">-->
                <!--<label class="box-label"-->
                       <!--for="">支付类型</label>-->
                <!--<select class="box-select"-->
                        <!--v-model="write.pay_type">-->
                  <!--<option :value="key"-->
                          <!--v-for="(item,key) in payTypeText"-->
                          <!--:key="key">{{item}}</option>-->
                <!--</select>-->
              <!--</div>-->
              <!--<div class="col-xs-12 col-sm-6 col-md-6 box-form-group">-->
                <!--<label class="box-label"-->
                       <!--for="">价格 ￥({{payTypeText[write.pay_type]}})</label>-->
                <!--<input type="text"-->
                       <!--class="box-input"-->
                       <!--v-model="write.price">-->
              <!--</div>-->
            <!--</div>-->

            <div class="tag-warp">
              <p class="common-title">
                APP标签
                <span>
                  <em id="chosen_tag_num">{{currentArticleTagArr.length}}</em>/3
                </span>
              </p>
              <div class="search-box clearfix"
                   ref="search_box">
                <div class="clearfix js-chosen-tags"
                     ref="js_chosen_tags"
                     v-show="currentArticleTagArr.length>0">
                  <span class="tag-item"
                        v-for="(item,key) in currentArticleTagArr"
                        :key="key"
                        @click="deleteCurrentArticleTag(item)">{{item.tagName}}</span>
                </div>
                <input class="search-input"
                       v-show="currentArticleTagArr.length<3"
                       placeholder="选择下列热门标签或输入关键词检索标签"
                       :style="{'width':searchBoxWidth}"
                       v-model="searchArticleTag" />
              </div>
              <p class="search-result js-search-result"
                 v-show="isSearchResultShow">
                相关“
                <span class="js-search-text">{{searchArticleTag}}</span>”的搜索
                <span class="js-search-num">{{searchShowArticleTagAll.length}}</span> 个
              </p>
              <div class="tag-list-view js-tag-nano has-scrollbar">
                <div class="clearfix js-tag-list">
                  <span class="tag-item"
                        v-for="(item,key) in searchShowArticleTagAll"
                        :key="key"
                        @click="addArticleTag(item)">{{item.tagName}}</span>
                </div>
              </div>
            </div>

            <div class="write-footer clearfix">
              <button class="send-article"
                      @click="saveArticle">发布APP</button>
            </div>

          </div>
        </div>
      </div>
    </section>
  </client-only>
</template>

<script>
// Local Registration
import * as qiniu from 'qiniu-js';
import { UploadImage } from '@components'
// import { mavonEditor } from '@components/MarkDown'
import { share, baidu, google } from '@utils'
import ClientOnly from 'vue-client-only'
import marked from "marked";
import { mapState } from 'vuex'
import googleMixin from '@mixins/google'
import {
  payTypeText,
  isFree,
  isFreeText
} from '@utils/constant'

export default {
  name: 'write',
  minixs: [googleMixin], //混合谷歌分析
  metaInfo () {
    return {
      title: "小书编辑",
      htmlAttrs: {
        lang: "zh"
      },
      script: [
        ...google.statisticsCode({
          route: this.$route, googleCode: this.website.config.googleCode, random: ''
        })
      ],
      __dangerouslyDisableSanitizers: ['script']
    };
  },
  async asyncData ({ store, route, accessToken = "" }) {
    // 触发 action 后，会返回 Promise
    return Promise.all([
      store.dispatch("PERSONAL_INFO", { accessToken }),
        store.dispatch("articleColumn/GET_ARTICLE_COLUMN_ALL",{pageNum:1,pageSize:10}),
      store.dispatch("articleTag/GET_ARTICLE_TAG_ALL")
    ]);
  },
  data () {
    return {
      write: {
        cover_img: '', // 小书封面图片
        title: '', // 小书的标题
        description: '', // 小书的简介
        content: '', // 小书的详情
        is_public: 1, // 是否公开 1公开 0仅自己可见
        is_free: 1, // 免费还是付费
        pay_type: 1,// 支付类型
        price: 0, // 价格
      },
      payTypeText, // 支付类型
      isFree, // 免费还是付费值
      isFreeText, // 免费还是付费
      publicTypeList: ['理财'], // 小书类型列表
      searchArticleTag: "",
      currentArticleTagArr: [], // 用户选中的小书标签
      isSearchResultShow: false, // 搜索结果显示
      searchShowArticleTagAll: [], // 搜索栏内呈现的小书标题
      searchBoxWidth: "100%",
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        mark: true, // 标记
        superscript: true, // 上角标
        quote: true, // 引用
        ol: true, // 有序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        help: true, // 帮助
        code: true, // code
        subfield: true, // 是否需要分栏
        fullscreen: true, // 全屏编辑
        /* 1.3.5 */
        undo: true, // 上一步
        trash: true, // 清空
        save: false, // 保存（触发events中的save事件）
        /* 1.4.2 */
      },
      editInfo: {} // 修改小书的信息
    }
  },
  created () {
    this.initArticleTagAll()
    if (this.$route.params.type !== "create") {
      this.isEdit()
    }
  },
  watch: {
    searchArticleTag (val) {
      let _arr = [];
      for (let item in this.articleTagAll) {
        if (
          this.articleTagAll[item].name
            .toLowerCase()
            .indexOf(this.searchArticleTag.toLowerCase()) >= 0
        ) {
          _arr.push(this.articleTagAll[item]);
        }
      }
      this.searchShowArticleTagAll = _arr;
      if (this.searchArticleTag.length === 0) {
        this.isSearchResultShow = false;
      } else {
        this.isSearchResultShow = true;
      }
    }
  },
  methods: {
    isEdit () {
      if (this.$route.params.type !== "create") {
        // 判断是不是创建，不是则是修改，同时赋值
        this.$store
          .dispatch("books/GET_USER_BOOKS_INFO", {
            books_id: this.$route.query.books_id
          })
          .then(result => {
            this.write = result.data.books;
            this.write.is_public = Number(result.data.books.is_public)
            this.write.content = result.data.books.origin_content;
            this.editInfo = result.data.books
            this.articleTagAll.map(item => {
              if (
                ~this.editInfo.tag_ids
                  .split(",")
                  .indexOf(String(item.tag_id))
              ) {
                this.currentArticleTagArr.push(item);
              }
            });
            this.renderCurrentArticleTag();
          });
      }
    },
      zh_uploadFile(){
          this.$refs.evfile.click();
      },
    changeUploadCoverImg (evfile) { // 上传封面图片
        //后端获取token
        let cdnUrl = 'http://q5fkyk2h0.bkt.clouddn.com/'
        this.$store
            .dispatch('setting/PERSONAL_UPLOAD_AVATAR').then(res=>{
            var uptoken = res.data.token
            var file = evfile.target.files[0] //Blob 对象，上传的文件
            var key = file.name  // 上传后文件资源名以设置的 key 为主，如果 key 为 null 或者 undefined，则文件资源名会以 hash 值作为资源名。

            let config = {
                useCdnDomain: true,   //表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
                region: qiniu.region.z2     // 根据具体提示修改上传地区,当为 null 或 undefined 时，自动分析上传域名区域
            };

            let putExtra = {
                fname: "",  //文件原文件名
                params: {}, //用来放置自定义变量
                mimeType: null  //用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
            };
            var observable = qiniu.upload(file, key, uptoken, putExtra, config);
            observable.subscribe({
                next: (result) => {
                    // 主要用来展示进度
                    console.log(result)
                },
                error: (errResult) => {
                    // 失败报错信息
                    console.log(errResult)
                },
                complete: (result) => {
                    // 接收成功后返回的信息
                    console.log(result.key)
                    this.write.cover_img = cdnUrl + result.key
                }
            })
        })
    },
    initArticleTagAll () {
      this.searchShowArticleTagAll = this.articleTagAll;
    },
    addArticleTag (val) {
      this.search_article_tag = "";
      let _arr = [];
      for (var item in this.currentArticleTagArr) {
        _arr.push(this.currentArticleTagArr[item].tagName);
      }
      if (
        this.currentArticleTagArr.length < 3 &&
        _arr.indexOf(val.tagName) === -1
      ) {
        this.currentArticleTagArr.push(val);
      }
      this.renderCurrentArticleTag();
    },
    deleteCurrentArticleTag (val) {
      for (var item in this.currentArticleTagArr) {
        if (
          val.tagName ===
          this.currentArticleTagArr[item].tagName
        ) {
          this.currentArticleTagArr.splice(item, 1);
        }
      }
      this.renderCurrentArticleTag();
    },
    renderCurrentArticleTag () {
      this.$nextTick(() => {
        this.searchBoxWidth =
          this.$refs.search_box.offsetWidth -
          this.$refs.js_chosen_tags.offsetWidth -
          15 +
          "px";
      });
    },
    getObjectValues (object) {
      var values = [];
      for (var property in object) {
        values.push(object[property].tag_id);
      }
      return values;
    },

    imageFilter (file) {
      if (file.size > 1 * 1024 * 1024) {
        this.$message.success("上传小书图片应该小于1M");
        return false
      } else {
        return true
      }
    },
    $imgAdd (pos, $file) {
      // 第一步.将图片上传到服务器.
      var formData = new FormData();
      formData.append('file', $file);
      this.$store
        .dispatch("editor/UPLOAD_ARTICLE_PICTURE", formData)
        .then(res => {
          if (res.state === "success") {
            this.$message.success("上传小书图片成功");
            this.$refs.mavonEditor.$img2Url(pos, res.data.img);
          } else {
            this.$message.warning(res.message);
            return false
          }
        });
    },
    saveArticle () {
      if (!this.write.name) {
        this.$message.warning('APP名称不能为空！');
        return false
      }
      if (!this.write.content) {
        this.$message.warning('APP内容不能为空！');
        return false
      }

      var params = {
        name: this.write.name, //APP名称
        description: this.write.description, //APP介绍
        url: this.write.cover_img,//APP的logo
        categoryId: this.write.category_id,// 类型
        categoryEnName: this.write.categoryEnName,
          tagIds: this
          .getObjectValues(this.currentArticleTagArr)
          .join(",")
      };
      this.$route.params.type !== "create" &&
        (params.books_id = this.$route.query.books_id);

      let dispatch_url =
        this.$route.params.type === "create"
          ? "apps/CREATE_APPS"
          : "apps/UPDATE_APPS";

      this.$store
        .dispatch(dispatch_url, params)
        .then(res => {
          if (res.status === 200) {
            this.$message.success(res.message);
            this.$router.push({
              name: "app",
              params: { columnEnName: 'all' }
            });
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(function (err) {
          this.$message.error("出现错误：" + err);
        });
    },
  },
  components: {
    UploadImage,
    ClientOnly
  },
  computed: {
    articleTagAll () {
      return this.$store.state.articleTag.article_tag_all;
    },
    columnAll(){
      return this.$store.state.articleColumn.homeColumn;
    },
    ...mapState(['website', 'personalInfo'])
  },
}
</script>

<style lang="scss" scoped>
.books-write-lay {
  .client-card-shadow {
    padding: 20px;
    margin-bottom: 30px;
  }
  .books-write-content {
    .cover-img {
      .cover-img-view {
        width: 160px;
        height: 160px;
        border: 1px solid #e0e0e0;
        border-radius: 3px;
        margin-bottom: 10px;
        display: block;
        overflow: hidden;
        p {
          font-size: 14px;
          padding: 30px;
        }
      }
      .upload-cover-image {
        width: 160px;
        display: block;
        line-height: 30px;
        font-size: 12px;
        border: 1px solid #2daebf;
        color: #2daebf;
        text-align: center;
        font-weight: 500;
        letter-spacing: 2px;
        border-radius: 3px;
      }
    }
    .book-info {
      .box-label {
        display: block;
      }
      .box-input {
        font-size: 14px;
        border: 1px solid #e0e0e0;
        border-radius: 3px;
        width: 100%;
      }
    }
  }
  .write {
    /deep/.markdown-panel {
      height: 500px;
      z-index: 249;
      &.fullscreen {
        z-index: 251;
      }
    }
  }

  .box-input,
  .box-select {
    border: 1px solid #e0e0e0;
    border-radius: 3px;
  }
  .box-select {
    height: 36px;
  }
  .box-input {
    height: 36px;
    padding: 0px 20px;
    width: 100%;
  }
  .tag-warp {
    margin-top: 5px;
    .common-title {
      span {
        margin-left: 4px;
        font-weight: 400;
        font-size: 12px;
        color: #93999f;
        line-height: 22px;
      }
    }
    .search-box {
      width: 100%;
      height: 36px;
      padding-left: 12px;
      margin-right: 12px;
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 3px;
      box-sizing: border-box;
      .search-input {
        width: 100%;
        height: 100%;
        float: left;
        font-size: 14px;
        border-radius: 6px;
        border: 0;
      }
    }
    .js-chosen-tags {
      float: left;
      height: 100%;
      .tag-item {
        margin-top: 5px;
      }
    }
    .tag-item {
      display: block;
      float: left;
      margin: 8px 8px 0 0;
      padding: 4px 12px;
      font-size: 12px;
      color: #545c63;
      line-height: 16px;
      background: rgba(84, 92, 99, 0.1);
      border-radius: 12px;
      cursor: pointer;
    }
    .search-result {
      margin: 24px 0 -16px;
      font-size: 12px;
      color: #9199a1;
      line-height: 18px;
      .js-search-text {
        color: #00bb29;
      }
      .js-search-num {
        color: #00bb29;
      }
    }
    .common-error-tip {
      margin-top: 2px;
      font-size: 12px;
      color: #f53d3d;
      line-height: 18px;
    }
    .tag-list-view {
      width: 100%;
      margin-top: 16px;
      height: auto !important;
      max-height: 300px;
      overflow-y: auto;
    }
  }

  .write-footer {
    margin: 20px 0;
    .send-article {
      padding: 5px 15px;
      background: #256ef8;
      border: none;
      color: #fff;
      border-radius: 5px;
      font-style: 16px;
    }
  }
}
</style>



