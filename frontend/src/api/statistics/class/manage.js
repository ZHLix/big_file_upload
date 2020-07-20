import Base from '../../base'

export default class StatisticsClassManage extends Base {
    init () {
        return this.result({
            table: {
                options: { border: true, minWidth: 100, pagination: { page: 1, pageSize: 10 } },
                head: {
                    index: { type: 'index' },
                    idcard: { label: '身份证号', minWidth: 200 },
                    name: { label: '姓名' },
                    class_name: { label: '班级名称', minWidth: 220, render: () => this.$vm.$route.params.class_name },
                    count_small_course: { label: '总学时' },
                    success_small_course: { label: '已完成学时' },
                    course_residue: {
                        label: '剩余学时', render: (h, text, { count_small_course, success_small_course }) => {
                            return count_small_course - success_small_course
                        }
                    },
                    // study_status: {
                    //     label: '学习状态', render: (h, text, { count_small_course, success_small_course }) => {
                    //         let status = { text: '未学习', color: 'red' }

                    //         if (success_small_course && success_small_course < count_small_course) { // 审核通过
                    //             status = { text: '学习中', color: 'blue' }
                    //         } else if (success_small_course === count_small_course) {
                    //             status = { text: '已完成', color: 'green' }
                    //         }
                    //         return `<span class="cu-tag bg-${status.color} light">${status.text}</span>`
                    //     }
                    // },
                    // real_name: {
                    //     label: '实名认证', render: (h, text, { user }) => {
                    //         let status = { text: '未认证', color: 'red' }
                    //         if (user) {
                    //             status = { text: '已认证', color: 'green' }
                    //         }
                    //         return `<span class="cu-tag bg-${status.color} light">${status.text}</span>`
                    //     }
                    // },
                    // ...this.tableToolbar((h, text, row) => {
                    //     return h('el-button', {
                    //         props: { type: 'text', disabled: !row.cert }, on: {
                    //             click: () => this.downloadCert(row)
                    //         }
                    //     }, '下载培训证书')
                    // }, { width: 200 })
                }
            },

            search: {
                options: { labelPosition: 'right', size: 'mini', inline: true },
                field: {
                    name: { label: '姓名' },
                    idcard: { label: '身份证号' },
                    // type: {
                    //     label: '学习状态', type: 'select', sub: [
                    //         { name: '未学习', value: 0 },
                    //         { name: '学习中', value: 1, },
                    //         { name: '已完成', value: 2 }
                    //     ]
                    // },
                    // real: {
                    //     label: '认证状态', type: 'select', sub: [
                    //         { name: '未认证', value: 0 }, { name: '已认证', value: 1 }
                    //     ]
                    // }
                }
            }
        })
    }

    async list (req) {
        const { page, limit } = req

        // console.log(req)
        const { class_id, class_course_count } = this.$vm.$route.params

        let { data: { count, rows: data }, code, msg } = await this.$root.$request.post('api/school/GetClassDetails', {
            ...this.params(req),
            class_id,
            count: class_course_count
        })

        return this.result({ table: data, pagination: { total: count, page, limit } }, code, msg)
    }


    // async downloadCert ({ cert, name }) {
    //     cert = cert.replace('app/', '')

    //     const blob = await this.$root.$request.$axios({
    //         url: `${this.$vm.$store.state.baseUrl}/../${cert}`,
    //         method: 'GET',
    //         responseType: 'blob'
    //     })

    //     console.log(typeof blob)

    //     if ('download' in document.createElement('a')) { // 非IE下载
    //         const elink = document.createElement('a')
    //         elink.download = `${name}.jpg`
    //         // elink.setAttribute('download', 'test.zip')


    //         elink.style.display = 'none'
    //         elink.href = window.URL.createObjectURL(blob)
    //         document.body.appendChild(elink)
    //         elink.click()
    //         window.URL.revokeObjectURL(elink.href) // 释放URL 对象
    //         document.body.removeChild(elink)
    //     } else { // IE10+下载
    //         navigator.msSaveBlob(blob, 'test.zip')
    //     }
    // }
}