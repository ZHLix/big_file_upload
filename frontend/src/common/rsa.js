/*
 * @Date: 2020-04-07 13:49:27
 * @LastEditors: zhlix <15127441165@163.com>
 * @LastEditTime: 2020-04-07 13:50:14
 * @FilePath: \frozen_food_mall\src\assets\rsa.js
 */
import JSEncrypt from 'jsencrypt'

export default class extends JSEncrypt {
    // constructor(public_key = null) {
    //     super();
    //     console.log(public_key)
    //     public_key && this.setPublicKey(public_key)
    // }
    constructor() {
        super()
        this.setPublicKey(`-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDuTzO76LBXmAavPM+b2LQTyjEr
8TM0GAAAt4ln0bKvN/N4ntWUJer1r/137mrIpXLo6r5ytkCRQk3tQa+7SPYmp67j
QSv5ybuPm5aTZ56FzQRNww/4aVcWSfQTZHpHyQt+piU7Ypr6jV1MCihgtvPLwYi7
ePpJFPJFQxWAoqORXQIDAQAB
-----END PUBLIC KEY-----`)
    }

    /**
   * 加密（可加密 object）
   * @param data
   */
    encode (data) {
        if (typeof data === 'object') data = JSON.stringify(data)
        return this.encrypt(data)
    }

    decode (data) {
        let res = this.decrypt(data)
        return res
    }
}
