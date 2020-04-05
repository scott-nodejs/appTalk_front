<template>
    <div class="home-lay index-container"
         id="index">
        <div class="row">
            <div class="col-xs-12 col-sm-8--4 col-md-8--4">
                <!--home-lay layout-content start-->
                <section class="client-card">
                    <!-- <NavHeader /> -->
                    <NavColumn :navItem="articleColumn.homeColumn" />
                    <NavSort @navTap="navTap"
                             ref="navSort"></NavSort>
                    <scroll-loading @scroll-loading="infiniteHandler"
                                    :isLoading="isLoading"
                                    :isMore="isMore">
                        <ArticleItem v-for="(item,key) in home.article.article_list"
                                     :key="key"
                                     :articleItem="item" />
                    </scroll-loading>

                </section>
                <!--home-lay layout-content end-->
            </div>
            <div class="col-xs-12 col-sm-3--6 col-md-3--6">
                <!--aside.html start-->
                <div class="home-aside">
                    <HomeAside />
                </div>
                <!--aside.html end-->
            </div>
        </div>
    </div>
</template>

<script>
    import HomeAside from "@views/Home/HomeAside";
    import NavHeader from "@views/Home/NavHeader";
    import NavColumn from "@views/Home/NavColumn";
    import NavSort from "@views/Home/NavSort";
    import ArticleItem from "@views/Article/component/ArticleItem";
    import { mapState } from "vuex";
    import { ScrollLoading } from "@components";

    export default {
        name: "Home",
        async asyncData ({ store, route, accessToken = "" }) {
            // 触发 action 后，会返回 Promise
            // return store.dispatch("home/GET_INDEX_ARTICLE_LIST")
            return Promise.all([
                store.commit("articleColumn/SET_CURRENT_ARTICLE_COLUMN"),
                store.commit("home/SET_INIT_INDEX_ARTICLE_LIST"), //重置文章列表数据
                store.dispatch("articleColumn/GET_ARTICLE_COLUMN_ALL",{pageNum:1,pageSize:10}),
                store.dispatch("home/GET_INDEX_ARTICLE_LIST",{pageNum:1}),
            ]);
        },
        data () {
            return {
                page: 2,
                sort: "",
                isLoading: false,
                isMore: true,
            };
        },
        beforeRouteUpdate (to, from, next) {
            // 在当前路由改变，但是该组件被复用时调用
            // this.initHomeDate()
            this.$refs.navSort.dafauleNav();
            this.isMore = true;
            next();
        },
        created () {
            this.$store.dispatch("home/GET_POPULAR_ARTICLE_TAG"); // 获取热门文章标签
        },
        methods: {
            navTap (val) {
                this.sort = val;
                this.initHomeDate();
            },
            initHomeDate () {
                this.$store.commit("home/SET_INIT_INDEX_ARTICLE_LIST"); // 重置文章列表数据
                this.isMore = true;
                this.page = 1;
                this.infiniteHandler();
            },
            infiniteHandler () {
                this.isLoading = true;
                this.$store
                    .dispatch("home/GET_INDEX_ARTICLE_LIST", {
                        column_en_name: this.$route.params.en_name,
                        pageNum: this.page
                    })
                    .then(result => {
                        this.isLoading = false;
                        if (result.data.nextPage !== 0) {
                            this.page += 1;
                        } else {
                            this.isMore = false;
                        }
                    })
                    .catch(err => {
                        this.isMore = false;
                    });
            }
        },
        computed: {
            ...mapState(["home", "articleColumn"]) // home:主页  article_column:文章的专栏
        },
        components: {
            HomeAside,
            NavHeader,
            NavColumn,
            ArticleItem,
            NavSort,
            ScrollLoading
        }
    };
</script>

<style scoped lang="scss">
    .home-lay {
        .client-card {
            position: relative;
            border-radius: 2px;
            padding: 0 15px;
            /deep/ .article {
                border-bottom: 1px solid #f7f7f7;
            }
        }
    }
    @media (max-width: 575px) {
        .home-lay .client-card {
            padding: 0 5px;
        }
    }
</style>
