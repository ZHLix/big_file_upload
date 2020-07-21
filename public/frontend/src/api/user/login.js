import Base from '../base'
import Encrypt from '../../common/rsa'

export default class UserLogin extends Base {
    async login (req) {
        const encrypt = new Encrypt()
        // 加密用户名密码(rsa 公钥加密)
        let encryptedData = encrypt.encrypt(JSON.stringify({
            username: req.username,
            password: req.password
        }))
        let { code, msg } = await this.$root.$request.post('api/user/login', { encryptedData, captcha: req.captcha })
        if (code === 200) {
            //   // 存入本地缓存
            sessionStorage.setItem('username', req.username)
            sessionStorage.setItem('authorization', 'true')
        }
        return this.result(null, code, msg)
    }
}