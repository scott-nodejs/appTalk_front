<template>

  <section class="article-list-lay layout-content ">
    <div class="container box-container">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12">
          <div class="user-message client-card"
               v-loading="isLoading">
            <h3 class="title">关注</h3>
            <div class="user-message-view">
              <div class="user-message-item attention"
                   v-for="(MessageItem,key) in messageList.list"
                   :key="key"
                   ref="user_message_list">
                <div class="main clearfix">
                  <router-link class="user-info"
                               :to="{name:'user',params:{uid:MessageItem.user.id,routeType:'article'}}">
                    <img class="avatar"
                         v-lazy="MessageItem.user.photo"
                         alt />
                    <span class="nickname">{{MessageItem.user.nickname}}</span>
                  </router-link>
                  <p class="time"> {{MessageItem.dateStr}}</p>
                  <div class="content">
                    <router-link style="color:#df5858"
                                 :to="{name:'article',params:{aid:MessageItem.article.id}}">{{MessageItem.article.title}}</router-link>
                  </div>
                </div>

              </div>
            </div>
            <Page :total="messageList.total"
                  :pageSize="messageList.pageSize"
                  :page="Number(messageList.pageNum)"
                  @pageChange="pageChange"></Page>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>



import { Page } from '@components'
import { mapState } from 'vuex'
import {
  modelType
} from '@utils/constant'
export default {
  name: 'UserMessage',
  data () {
    return {
      isLoading: false,
      modelType,
      messageList: {
        // 用户消息
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
    }
  },
  created () {
    this.$store.dispatch('user/GET_UNREAD_MESSAGE_COUNT')
  },
  mounted () {
    this.getUserMessageList()
  },
  methods: {
    getUserMessageList () {
      this.$store.dispatch('user/GET_ATTENTION_MESSAGE_LIST', {
        pageNum: this.messageList.page || 1,
        pageSize: this.messageList.pageSize || 10,
      }).then(result => {
        this.messageList = result.data
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    },
    deleteChange () {
      this.getUserMessageList()
    },
    pageChange (val) {
      this.messageList.page = val
      this.getUserMessageList()
    },
  },
  computed: {
    ...mapState(["personalInfo", 'user'])
  },
  components: {
    Page
  }
}
</script>

<style scoped lang="scss">
.user-message {
  padding: 30px;
  .title {
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(178, 186, 194, 0.15);
  }
  .user-message-view {
    padding-top: 20px;
    .user-message-item {
      position: relative;
      border-bottom: 1px solid rgba(178, 186, 194, 0.15);
      padding: 20px;
      &.attention {
        .user-info {
          display: inline-block;
          margin-right: 10px;
          .avatar {
            display: inline-block;
            width: 38px;
            height: 38px;
            border-radius: 100px;
          }
          .nickname {
            font-size: 14px;
            display: inline-block;
            margin-left: 10px;
          }
        }
      }
      .time {
        display: inline-block;
        font-size: 14px;
        padding: 0 10px;
      }
      .content {
        margin-top: 7px;
        display: inline-block;
        font-size: 14px;
        p {
          display: inline-block;
          font-size: 14px;
        }
      }
      &:hover {
        .delete-message {
          opacity: 1;
        }
      }
    }
  }
}
</style>
