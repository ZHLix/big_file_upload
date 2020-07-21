<template>
  <div class="login-container flex justify-center align-center">
    <div class="login-wrapper cu-card animation-slide-bottom">
      <div class="cu-item bg-white shadow padding-lg">

        <!-- 标题 -->
        <div class="title cu-bar padding-bottom margin-bottom">
          <span class="cuIcon-titles text-xl text-blue">知了学仕后台管理系统</span>
        </div>

        <!-- 表单 -->
        <c-form ref="form"
                :fields="form"
                :config="{labelPosition: 'top'}"
                @submit="login"></c-form>

        <div class="margin-tb">
          <el-button type="primary"
                     class="w-100"
                     @click="login"
                     :loading="loading">登录</el-button>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
export default {
    component: {},
    data() {
        return {
            /**
             * 表单
             */
            form: {
                username: {
                    label: '账号',
                    autofocus: true,
                    rules: [{ required: true, message: '账号不能为空' }]
                },

                password: {
                    label: '密码',
                    type: 'password',
                    rules: [{ required: true, message: '密码不能为空' }]
                },

                captcha: {
                    label: '验证码',
                    // append: {},
                    suffixRender: () => {
                        const h = this.$createElement
                        return h('img', {
                            ref: 'captcha',
                            class: 'margin-left',
                            attrs: { src: '/captcha' },
                            on: {
                                click: () => {
                                    this.$refs.captcha.setAttribute(
                                        'src',
                                        `/captcha?v=${Math.random()}`
                                    )
                                }
                            }
                        })
                    },
                    rules: [{ required: true, message: '验证码不能为空' }]
                }
            },

            /**
             * 提交状态
             */
            loading: false
        }
    },

    methods: {
        /**
         * 登录行为
         */
        async login() {
            const data = await this.$refs.form.validate()
            this.loading = true
            // 发送登录请求
            const { code, msg } = await this.$api.UserLogin.login(data)
            this.loading = false
            if (code === 400) {
                this.$message.error(msg)
                // 更新验证码
                this.$refs.captcha.click()
                return false
            }
            this.$message.success(msg)
            await this.$utils.setTimeout(600)
            location.reload()
        }
    }
}
</script>


<style lang="scss">
.w-100 {
  width: 100%;
}

svg {
  float: right;
  clear: both;
}
</style>

<style lang="scss"
       scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  .login-wrapper {
    min-width: 412px;
    overflow: initial;

    & > .cu-item {
      transform: translateY(-50px);
    }
  }
}
</style>