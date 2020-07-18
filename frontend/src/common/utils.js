/* eslint-disable indent */
/*
 * @Date: 2020-04-07 13:49:27
 * @LastEditors: zhlix <15127441165@163.com>
 * @LastEditTime: 2020-04-07 13:50:00
 * @FilePath: \frozen_food_mall\src\assets\utils.js
 */
class Utils {
    constructor(vm) {
        this.$vm = vm
    }


    setTimeout (time) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, time)
        })
    }

    formatSeconds (value, zh = true) {

        let theTime = parseInt(value)// 秒
        let middle = 0// 分
        let hour = 0// 小时

        if (theTime > 60) {
            middle = parseInt(theTime / 60)
            theTime = parseInt(theTime % 60)
            if (middle > 60) {
                hour = parseInt(middle / 60)
                middle = parseInt(middle % 60)
            }
        }
        theTime = parseInt(theTime)
        if (!zh && theTime < 10) theTime = `0${theTime}`
        let result = '' + theTime + (zh ? '秒' : '')

        middle = parseInt(middle)
        if (!zh && middle < 10) middle = `0${middle}`
        result = '' + middle + (zh ? '分' : ':') + result

        hour = parseInt(hour)
        if (!zh && hour < 10) hour = `0${hour}`
        result = '' + hour + (zh ? '小时' : ':') + result
        return result
    }

    str2Seconds (value) {
        let arr = value.split(':').map(v => parseInt(v))

        return arr[0] * 3600 + arr[1] * 60 + arr[2]
    }

    //生成从minNum到maxNum的随机数
    random (minNum, maxNum) {
        if (arguments.length == 1) {
            return parseInt(Math.random() * minNum + 1, 10)
        } else if (arguments.length == 2) {
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
        }
        return 0
    }



    timeFormat (param) {
        return param < 10 ? '0' + param : param
    }

    countDown (actEndTime, func) {
        let tmp = () => {

            let obj = null

            if (actEndTime <= 0) {
                clearInterval(interval)
            }

            actEndTime -= 1
            // let time = actEndTime
            // 获取天、时、分、秒
            let day = parseInt(actEndTime / (60 * 60 * 24))
            let hour = parseInt(actEndTime % (60 * 60 * 24) / 3600)
            let min = parseInt(actEndTime % (60 * 60 * 24) % 3600 / 60)
            let sec = parseInt(actEndTime % (60 * 60 * 24) % 3600 % 60)
            obj = {
                day, //: day, // this.timeFormat(day),
                hour, //: this.timeFormat(hour),
                min, //: this.timeFormat(min),
                sec, //: this.timeFormat(sec)
            }
            let str = ''
            if (obj.day) str += `${obj.day}天`
            if (obj.hour) str += `${obj.hour}时`
            if (obj.min) str += `${obj.min}分`
            if (obj.sec) str += `${obj.sec}秒`

            func && func(str, obj, interval, actEndTime)
        }
        tmp()
        let interval = setInterval(tmp, 1000)
        return interval
    }
}

const install = (Vue, vm) => {
    Vue.prototype.$utils = new Utils(vm)
}

export default { install }