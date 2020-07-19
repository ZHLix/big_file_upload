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
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAupEe3y/Qt9WVQMw/P9uG
jZaxe+iJ567abTxQ7KiBxwo04lfFUboCt5GxPTndgY/Ly9r2EguSSDAEXwYI0Aq1
6VvVjQD2iHPOZnaLfxwkHbPUzlNr5r9Lftzpz5yGDEI5tt3vWEogZq+hQ2UWIcx7
RHlwcUC8Gcn5RmL5L84AfbisrJvpOGKyMSC1A8PjZ4MfJsTEgNviblCd6RmMEEd5
IfrFA2AWM9YT1sbloqWZZOPsPoRgrGj96ABBN4VhpGni2LhOF9tEDppovx6lMB0M
siwxb47Bgim1QrHg7DuLlXUHCs/cGX2DQdIFcL2gSQou6K4dWZL0xmysd3G1ndOo
/QIDAQAB
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
