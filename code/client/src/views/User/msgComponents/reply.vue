<template>
  <div class="user-center-message-item"
       ref="user_message_list">
    <div class="title">{{MessageItem.actionText}} {{MessageItem.createDate}}</div>

    <div class="main clearfix">
      <router-link class="user-info"
                   :to="{name:'user',params:{uid:MessageItem.senderUser.id,routeType:'article'}}">
        <img class="avatar"
             v-lazy="MessageItem.senderUser.photo"
             alt />
        <span class="nickname">{{MessageItem.senderUser.nickname}}</span>
      </router-link>

      <div class="content">
        {{userMessageTypeText[MessageItem.type][MessageItem.action]}}
        <router-link style="color:#df5858"
                     v-if="MessageItem.type===modelType.article_comment"
                     :to="{name:'article',params:{aid:MessageItem.articleId.aid}}">{{MessageItem.replyComment.content}}</router-link>
        <router-link style="color:#df5858"
                     v-if="MessageItem.type===modelType.dynamic_comment"
                     :to="{name:'dynamicView',params:{dynamicId:MessageItem.replyComment.dynamic_id}}">{{MessageItem.replyComment.content}}</router-link>
        <router-link style="color:#df5858"
                     v-if="MessageItem.type===modelType.books_comment"
                     :to="{name:'book',params:{books_id:MessageItem.replyComment.books_id}}">{{MessageItem.replyComment.content}}</router-link>
        <router-link style="color:#df5858"
                     v-if="MessageItem.type===modelType.book_comment"
                     :to="{name:'BookView',params:{books_id: MessageItem.replyComment.books_id, book_id: MessageItem.replyComment.book_id}}">{{MessageItem.replyComment.content}}</router-link>
      </div>

      <div class="content-text">
        <template v-if="MessageItem.comment">
          <p v-html="commentRender(MessageItem.comment.content||'评论被用户删除')"
             v-if="Number(MessageItem.comment.status)===statusList.reviewSuccess||Number(MessageItem.comment.status)===statusList.freeReview"></p>
          <p v-else-if="Number(MessageItem.comment.status)===statusList.pendingReview"
             style="color:#f96b84;">当前用户评论需要管理员审核才能可见</p>
          <p v-else-if="Number(MessageItem.comment.status)===statusList.reviewFail"
             style="color:#f96b84;">当前用户评论违规</p>
        </template>
        <template v-else>
          <p style="color:#f96b84;">评论被删除</p>
        </template>
      </div>
      <span class="delete-message"
            @click="deleteUserMessage(MessageItem.id)">删除</span>
    </div>

  </div>
</template>

<script>
import { faceQQ } from '@components'
import {
  statusList,
  statusListText,
  modelType,
  userMessageTypeText,
  userMessageAction,
  userMessageActionText
} from '@utils/constant'
export default {
  name: "UserMessageItem",
  props: {
    MessageItem: {
      type: Object
    }
  },
  data () {
    return {
      statusList,
      modelType,
      userMessageTypeText,
      typeList: ["", "系统消息", "喜欢文章", "关注标签", "用户关注", "评论", "动态评论"]
    };
  },
  methods: {
    deleteUserMessage (id) {
      this.$confirm("此操作将永久该消息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("user/DELETE_USER_MESSAGE", {
              user_message_id: id
            })
            .then(result => {
              if (result.state === "success") {
                this.$message.success(result.message);
                this.$emit("delete-change");
              } else {
                this.$message.warning(result.message);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => { });
    },
    commentRender (val) {
      let newComment = val;
      faceQQ.map(faceItem => {
        newComment = newComment.replace(
          new RegExp("\\" + faceItem.face_text, "g"),
          faceItem.face_view
        );
      });
      return newComment;
    }
  }
};
</script>

<style scoped lang="scss">
.user-center-message-item {
  position: relative;
  .title {
    font-size: 14px;
    color: #999;
  }
  .main {
    margin-top: 10px;
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
    .content {
      margin-top: 7px;
      display: inline-block;
      font-size: 14px;
      p {
        display: inline-block;
        font-size: 14px;
      }
    }
    .content-text {
      display: block;
      padding: 8px 15px;
      margin-top: 15px;
      background: #f7f7f7;
      border-radius: 10px;
      font-size: 14px;
      color: #393939;
      p {
        font-size: 14px;
      }
    }
    .delete-message {
      opacity: 0;
      position: absolute;
      top: 20px;
      right: 10px;
      width: 80px;
      height: 25px;
      line-height: 23px;
      text-align: center;
      border-radius: 15px;
      border: 1px solid #ffc107;
      transition: 0.3s all;
      font-size: 14px;
      color: #ffc107;
      cursor: pointer;
    }
  }
  &:hover {
    .delete-message {
      opacity: 1;
    }
  }
  .no-info {
    font-size: 14px;
    color: #666;
  }
}
</style>
