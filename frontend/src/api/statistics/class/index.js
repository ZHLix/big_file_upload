import Base from '../../base'

export default class StatisticsClass extends Base {
    init () {
        return this.result({
            table: {
                options: { size: 'small', pagination: { pageSize: 10, page: 1 } },
                head: {
                    index: { type: 'index' },
                    class_no: { label: '班级编号', },
                    class_name: { label: '班级名称', },
                    course_name: { label: '课程', },
                    // count_small_course: { label: '学时' },
                    start_time: { label: '开班时间' },
                    end_time: { label: '结束时间' },
                    ...this.tableToolbar({
                        class_info: {
                            title: '班级详情', type: 'text', click: row => {
                                this.$vm.$router.push({
                                    name: 'statistics-class/manage',
                                    params: {
                                        class_id: row.id,
                                        class_course_count: row.count_small_course,
                                        class_name: row.class_name
                                    }
                                })
                            }
                        },
                        // download: {
                        //     title: '批量下载培训证书', type: 'text', click: row => {
                        //         this.download(row)
                        //     }
                        // }
                    }, { width: 280 })
                }
            },
            // form: {
            //     options: { labelPosition: 'top' },
            //     field: {
            //         name: { label: 'name' }
            //     }
            // },

            search: {
                options: { labelPosition: 'right', size: 'mini', inline: true },
                field: {
                    class_name: { label: '班级名称' },
                    date_range: { label: '开班时间', type: 'daterange', startPlaceholder: '开班时间', endPlaceholder: '结束时间' }
                    // start_time: {label: '开班时间', type: 'date'},
                    // end_time  : {label: '结束时间', type: 'date'}
                }
            }
        })
    }


    async list (req) {
        const { page, limit } = req

        // if (req.search?.date_range) {
        //     const [start_time, end_time] = req.search.date_range.split('~')
        //     req.search = Object.assign(req.search, { start_time, end_time })
        // }
        // delete req.search?.date_range

        let { data: { count, rows: data }, code, msg } = await this.$root.$request.post('api/school/GetClassStudy', this.params(req))
        // console.log(data)
        return this.result({ table: data, pagination: { total: count, page, limit } }, code, msg)
    }

    // async download ({ id, class_name }) {
    //     try {
    //         let res = await this.$root.$request.post('school/GetClassCert', { class_id: id }, { 'response-Type': 'blob' })
    //         if (typeof res === 'object') {
    //             const { success, msg } = res
    //             if (!success) {
    //                 this.$vm.$message.warning(msg)
    //             }
    //             return false
    //         }

    //         const blob = await this.$root.$request.$axios({
    //             url: `${this.$vm.$store.state.baseUrl}/school/GetClassCert`,
    //             method: 'POST',
    //             data: { class_id: id },
    //             responseType: 'blob'
    //         })

    //         console.log(typeof blob)

    //         if ('download' in document.createElement('a')) { // 非IE下载
    //             const elink = document.createElement('a')
    //             elink.download = `${class_name}.zip`
    //             // elink.setAttribute('download', 'test.zip')


    //             elink.style.display = 'none'
    //             elink.href = window.URL.createObjectURL(blob)
    //             document.body.appendChild(elink)
    //             elink.click()
    //             window.URL.revokeObjectURL(elink.href) // 释放URL 对象
    //             document.body.removeChild(elink)
    //         } else { // IE10+下载
    //             navigator.msSaveBlob(blob, `${class_name}.zip`)
    //         }

    //     } catch (e) {
    //         console.log('err', e)
    //     }
    // }
}