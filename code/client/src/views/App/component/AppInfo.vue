<template>
  <div class="book-info">
    <div class="book-content-head">APP介绍</div>
    <div class="article-content box-article-view"
         v-html="apps.appsInfo.content">
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
    font-size: 20px;
    border-bottom: 1px solid #ececec;
  }
}
</style>
