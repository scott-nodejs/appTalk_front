<template>
  <ClientOnly>
    <section class="sign-lay layout-content"
             id="reset-password">

      <div class="sign-view client-card">
        <div class="title">
          重置密码
        </div>
        <div class="js-sign-in-container">
          <form>

            <div class="input-prepend email-view">
              <input placeholder="邮箱"
                     type="text"
                     class="send-email-input account"
                     v-model="formData.email">
              <i class="el-icon-message"></i>
              <send-code :isSend="isSendCodeSuccess"
                         v-model="isSendCode"
                         @click.native="sendCode"
                         storage-key="reset-sendEmailCode"
                         class="btn-send-email-code btn" />
            </div>

            <div class="input-prepend">
              <input placeholder="请输入验证码"
                     type="text"
                     v-model="formData.code"
                     class="send-email-code code">
              <i class="el-icon-chat-round"></i>
            </div>

            <div class="input-prepend">
              <input placeholder="新密码"
                     type="password"
                     class="password"
                     v-model="formData.password">
              <i class="el-icon-key"></i>
            </div>

            <div class="input-prepend">
              <input placeholder="重复新密码"
                     type="password"
                     class="double_password"
                     v-model="formData.confirm">
              <i class="el-icon-key"></i>
            </div>

            <button @click="resetSubmit"
                    class="sign-in-button"
                    type="button">
              重置密码
            </button>
          </form>
          <!-- 更多登录方式 -->
          <div class="sign-footer">
            <a class="return-btn"
               href="javascript:;"
               @click="tapSign">返回登录</a>
          </div>
        </div>
      </div>
    </section>
  </ClientOnly>
  <!--home-lay layout-content end-->
</template>

<script>
import { cookie } from '../../../../server/utils/cookie'
import { sendCode } from '@components'
import ClientOnly from 'vue-client-only'
export default {
  name: 'ResetPassword',
  data () {
    return {
      isSendCode: false,
      isSendCodeSuccess: false,
      formData: {
        email: '',
        code: '',
        loginType: 'email',
        password: '',
        confirm: ''
      }
    }
  },
    methods: {
        tapRegister () {
            this.$router.push({ name: 'signUp' })
        },
        tapSign () {
            this.$router.push({ name: 'signUp' })
        },
        sendCode () { // 发送注册验证码
            this.isSendCodeSuccess = true
            this.$store.dispatch('sign/RESET_PASSWORD_CODE', {
                email: this.formData.email,
                type: '2'
            })
                .then(res => {
                    this.isSendCodeSuccess = false
                    if (res.code === 200) {
                        this.isSendCode = true
                    } else {
                        this.$message.warning(res.msg);
                    }
                })
        },
        resetSubmit () {
            this.$store.dispatch('sign/RESET_PASSWORD', this.formData)
                .then(result => {
                    this.$nextTick(function () {
                        if (result.data.code === 200) {
                            this.$message.success('重置密码成功')
                            cookie.delete('accessToken')
                            // window.location.reload()
                        } else {
                            this.$message.warning(result.data.msg)
                        }
                    })
                })
        }
    },
  components: {
    'send-code': sendCode,
    ClientOnly
  }
}
</script>

<style scoped lang="scss">
/*sign-in start*/
</style>
