import Base from '../base'
import Encrypt from '../../common/rsa'

export default class User extends Base {
    dropdownData = {
        changePassword: {
            name: '修改密码', click: _this => {
                let h = _this.$createElement
                _this.$msgbox({
                    title: '修改密码',
                    message: h('div', { class: 'padding-tb' }, [
                        h('c-form', {
                            ref: 'form',
                            attrs: {
                                config: {
                                    labelPosition: 'top'
                                }, validator: {
                                    eq: (val, rows, rule) => val === rows[rule],
                                    neq: (val, rows, rule) => val !== rows[rule]
                                },
                                fields: {
                                    password_old: { label: '当前密码', rules: [{ required: true, message: '请填写当前密码' }] },
                                    password_new: {
                                        label: '新密码',
                                        rules: [{ required: true, message: '请填写新密码' }, { neq: 'password_old', message: '请更换新密码' }]
                                    },
                                    password_confirm: {
                                        label: '确认密码',
                                        rules: [{ required: true, message: '请填写确认密码' }, { eq: 'password_new', message: '两次输入密码不一致' }]
                                    },

                                    captcha: {
                                        label: '验证码',
                                        // append: {},
                                        suffixRender: () => {
                                            return h('img', {
                                                ref: 'captcha',
                                                class: 'margin-left',
                                                attrs: { src: '/captcha' },
                                                on: {
                                                    click: () => {
                                                        _this.$refs.captcha.setAttribute(
                                                            'src',
                                                            `/captcha?v=${Math.random()}`
                                                        )
                                                    }
                                                }
                                            })
                                        },
                                        rules: [{ required: true, message: '验证码不能为空' }]
                                    }
                                }
                            }
                        })
                    ]),
                    showCancelButton: true,
                    closeOnClickModal: false,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    beforeClose: async (action, instance, done) => {
                        if (action === 'confirm') {
                            let res = await _this.$refs.form.validate()
                            instance.confirmButtonLoading = true
                            instance.confirmButtonText = '执行中...'
                            const result = await this.changePassword(res)
                            if (!result) {
                                _this.$refs.captcha.click()
                            }
                        }
                        instance.confirmButtonLoading = false
                        done()
                    }
                }).catch(() => { })

            }
        },
        logout: { name: '退出登录', divided: true, click: (_this) => this.logout(_this) }
    }

    async changePassword (req) {
        // 加密用户名密码(rsa 公钥加密)
        const encrypt = new Encrypt()
        let encryptedData = encrypt.encrypt(JSON.stringify({
            password_old: req.password_old,
            password_new: req.password_new,
            password_confirm: req.password_confirm
        }))
        const { code, msg } = await this.$root.$request.post('api/user/changePassword', { encryptedData, captcha: req.captcha })
        if (code !== 200) {
            this.$vm.$message.error(msg)
            return false
        }
        this.$vm.$message.success('修改成功，请重新登录')
        await this.logout()
    }

    async logout () {
        sessionStorage.removeItem('authorization')
        sessionStorage.removeItem('username')

        const { code, msg } = await this.$root.$request.post('api/user/logout')

        if (code !== 200) {
            this.$vm.$message.error(msg)
            return false
        }

        this.$vm.$message.success(msg)
        await this.$vm.$utils.setTimeout(600)
        this.$vm.$router.go()
    }
}