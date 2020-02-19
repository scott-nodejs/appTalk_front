<template>
  <div class="view setting-view client-card">
    <div class="sub-view-box setting-profile-view">
      <h1>个人资料</h1>

      <ul class="setting-list">
        <li class="item-view">
          <span class="title">头像</span>
          <div class="avatar-uploader avatar-uploader">
            <div class="avatar">
              <img
                      :src="formData.photo"

                class="box-image"
                alt=""
              />
            </div>
            <div class="action-box">
              <div class="hint">
                支持 jpg、png 格式大小 1M 以内的图片
                <span
                  class="hint-review"
                  v-if="
                    formData.avatar_review_status === 1 ||
                      formData.avatar_review_status === 3
                  "
                >
                  ({{
                    formData.avatar_review_status === 1
                      ? '新头像正在审核中，审核通过则显示，否则将换回原头像'
                      : '头像审核失败，请重新上传'
                  }})
                </span>
              </div>
              <!--<upload-image class="upload-image" @changeUpload="changeAvatar"-->
                <!--&gt;上传图片</upload-image-->
              <!--&gt;-->
              <Button type="ghost" class="upload-image" icon="ios-cloud-upload-outline" @click="zh_uploadFile">选择文件</Button>
              <input type="file" ref="evfile" @change="zh_uploadFile_change" style="display:none">
            </div>
          </div>
        </li>
        <li class="item-view">
          <span class="title">昵称</span>
          <div class="input-box profile-input profile-input">
            <input
              v-model="formData.nickname"
              placeholder="填写你的昵称"
              class="input"
            />
          </div>
        </li>

        <li class="item-view">
          <span class="title">性别</span>
          <div class="input-box profile-radio">
            <input
              type="radio"
              name="sex"
              value="1"
              v-model="formData.gender"
            /><span>男</span>
            <input
              type="radio"
              name="sex"
              value="2"
              v-model="formData.gender"
            /><span>女</span>
            <input
              type="radio"
              name="sex"
              value="0"
              v-model="formData.gender"
            /><span>保密</span>
          </div>
        </li>

        <!-- <li class="item-view">
          <span class="title">开启消息推送</span>
          <div class="input-box profile-radio">
            <input type="radio"
                   name="msgPush"
                   value="1"
                   v-model="formData.is_msg_push"><span>开启</span>
            <input type="radio"
                   name="msgPush"
                   value="2"
                   v-model="formData.is_msg_push"><span>关闭</span>
          </div>
        </li> -->

        <li class="item-view">
          <span class="title">职业</span>
          <div class="input-box profile-input profile-input">
            <input
              placeholder="填写你的职业"
              v-model="formData.position"
              class="input"
            />
          </div>
        </li>
        <li class="item-view">
          <span class="title">公司</span>
          <div class="input-box profile-input profile-input">
            <input
              placeholder="填写你的公司"
              v-model="formData.company"
              class="input"
            />
          </div>
        </li>
        <li class="item-view">
          <span class="title">个人介绍</span>
          <div class="input-box profile-input profile-input">
            <input
              v-model="formData.introduction"
              placeholder="填写职业技能、擅长的事情、喜欢的事情等"
              class="input"
            />
          </div>
        </li>
        <li class="item-view">
          <span class="title">个人主页</span>
          <div class="input-box profile-input profile-input">
            <input
              placeholder="填写你的个人主页"
              v-model="formData.home_page"
              class="input"
            />
          </div>
        </li>
      </ul>

      <div class="footer-view">
        <button class="button button-save" @click="updateUserInfo">保存</button>
      </div>
    </div>
  </div>
</template>

<script>
import { UploadImage } from '@components'
import { share, baidu, google } from '@utils'
import { mapState } from 'vuex'
import googleMixin from '@mixins/google'
import * as qiniu from 'qiniu-js';

export default {
  name: 'profile',
  mixins: [googleMixin], //混合谷歌分析
  metaInfo() {
    return {
      title: '个人设置-修改信息',
      htmlAttrs: {
        lang: 'zh'
      },
      script: [
        ...google.statisticsCode({
          route: this.$route,
          googleCode: this.website.config.googleCode,
          random: ''
        })
      ],
      __dangerouslyDisableSanitizers: ['script']
    }
  },
  data() {
    return {
      user_info: '',
      formData: {
        nickname: '',
        gender: '',
        is_msg_push: 0,
          position: '',
        company: '',
        introduction: '',
        home_page: '',
        photo: '',
        avatar_review: '',
        avatar_review_status: 0
      },
      file: {}
    }
  },
  created() {
    this.getCurrUserInfo()
  },
  methods: {
    getCurrUserInfo() {
      // 获取当前登录用户信息
      this.$store
        .dispatch('user/GET_USER_INFO_ALL', { uid: this.personalInfo.user.id })
        .then(result => {
          this.$nextTick(() => {
            if (result.code === 200) {
              // this.user_info = result.data
              this.formData = {
                ...result.data.user
              }
            }
          })
        })
    },
    updateUserInfo() {
      this.$store
        .dispatch('setting/PERSONAL_UPLOAD_INFO', this.formData)
        .then(result => {
          this.$nextTick(() => {
            console.log(result)
            if (result.status === 200) {
              this.$message.success('保存成功')
              this.getCurrUserInfo()
            } else {
              this.$message.warning(result.message)
            }
          })
        })
    },
    changeAvatar({ formData, config }) {
      console.log("changeAvatar: "+formData)
      this.$store
        .dispatch('setting/PERSONAL_UPLOAD_AVATAR', formData)
        .then(result => {
          this.$nextTick(function() {
            if (result.code === 200) {
              this.$message.success('上传用户头像功成，头像正在审核中')
              this.getCurrUserInfo()
            } else {
              this.$message.warning(result.message)
            }
          })
        })
    },
      zh_uploadFile(){
          this.$refs.evfile.click();
      },
      //选择文件后触发的事件
      zh_uploadFile_change(evfile){
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
                      this.formData.photo = cdnUrl + result.key
                  }
              })
          })
      },

  },
  computed: {
    ...mapState(['personalInfo', 'website'])
  },
  components: {
    UploadImage
  }
}
</script>

<style scoped lang="scss">
.setting-view {
  // box-shadow: 0 1px 3px 0px rgba(0, 0, 0, 0.1);
  // border-radius: 5px;
  padding: 30px;
  background: #ffffff;
  .sub-view-box {
    > h1 {
      color: #333333;
      font-size: 20px;
      font-weight: bold;
      padding-bottom: 20px;
      border-bottom: 1px solid #f1f1f1;
    }
    .setting-list {
      .item-view {
        padding: 24px 0;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        border-bottom: 1px solid #f1f1f1;
        .title {
          font-size: 14px;
          color: #333;
          width: 120px;
        }
        .avatar-uploader {
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
        }
        .input-box {
          flex: 1;
          input {
            width: 100%;
          }
        }
        .profile-radio {
          input {
            width: auto;
            display: inline-block;
          }
          span {
            margin: 0 20px 0 6px;
            font-size: 15px;
            vertical-align: middle;
          }
        }
        .input {
          display: block;
          border: none;
          outline: none;
          color: #909090;
          font-size: 14px;
        }
        .avatar {
          display: inline-block;
          position: relative;
          -webkit-box-flex: 0;
          -ms-flex: 0 0 auto;
          flex: 0 0 auto;
          width: 72px;
          height: 72px;
          margin-right: 12px;
          .box-image {
            width: 72px;
            height: 72px;
            border-radius: 4px;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
              border-radius: 80px;
            }
          }
        }
        .hint {
          color: #909090;
          font-size: 12px;
          margin-bottom: 18px;
          .hint-review {
            color: #ff4d4f;
            font-size: 12px;
          }
        }
        /deep/.UploadImage {
          background: #007fff;
          color: #fff;
          font-size: 12px;
        }
        .button,
        button {
          font-size: 12px;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-color: #007fff;
          color: #fff;
          border-radius: 2px;
          border: none;
          padding: 6px 15px;
          outline: none;
          transition: background-color 0.3s, color 0.3s;
          cursor: pointer;
        }
      }
    }
    .action-box,
    .footer-view {
      margin-left: 12px;
      .hint {
        color: #909090;
        font-size: 12px;
        margin-bottom: 18px;
      }
      .button,
      button {
        font-size: 12px;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-color: #007fff;
        color: #fff;
        border-radius: 2px;
        border: none;
        display: inline-block;
        padding: 6px 15px;
        outline: none;
        transition: background-color 0.3s, color 0.3s;
        cursor: pointer;
      }
      .upload-image {
        border-radius: 2px;
        border: none;
        display: inline-block;
        padding: 6px 15px;
      }
      .button-save {
        padding: 8px 30px;
        font-size: 14px;
        margin-top: 20px;
      }
    }
  }
}
</style>
