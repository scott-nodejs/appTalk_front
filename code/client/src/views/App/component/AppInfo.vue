<template>
  <div class="book-info">
    <div class="app-desc">应用截图</div>
    <div class="appimg-list">
      <div class="appimg-box">
        <img class="appimg" v-for="appimg in apps.appsInfo.images" v-bind:src="appimg"/>
      </div>
    </div>
    <div class="app-desc">应用描述</div>
    <div class="article-content box-article-view"
         v-html="apps.appsInfo.description">
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: "AppInfo",
  computed: {
    ...mapState(['apps', 'personalInfo'])
  }
};
</script>

<style scoped lang="scss">
.book-info {
  .book-content-head {
    position: relative;
    font-weight: 700;
    margin-bottom: 20px;
    color: #333;
    line-height: 1.5;
    padding-bottom: 12px;
    font-size:15px;
    border-bottom: 1px solid #ececec;
  }
  .app-desc {
    margin-top: 15px;
    margin-bottom: 10px;
    min-height: 15px;
    line-height: 20px;
    color: #333;
    font-size:10px;
  }
  .appimg-list {
    display: block;
    zoom: 1;
    width: 100%;
    height: 300px;
    margin-top: 16px;
    margin-left: -9px;
    overflow-x: auto;
    overflow-y: hidden;
  }
  .appimg-list .appimg-box{
    display: block;
    zoom: 1;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }
  .appimg-list .appimg-box .appimg {
    flex-shrink: 0;
    height: 300px;
    min-width: 168px;
    margin-left: 9px;
    border: 1px solid #eee;
    border-radius: 6px;
  }
  .article-content {
    color: #71777c;
    font-size:10px;
    line-height: 1.5;
  }
}
</style>
