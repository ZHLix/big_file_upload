import base from '../base'

export default class CourseClass extends base {
    course_id = 0
    course = {}

    init () {
        this.course_id = this.$vm.$parent.value
        this.course = this.$vm.$parent.course

        return this.result({
            table: {
                options: { border: true, pagination: { pageSize: 100, page: 1 } },
                head: {
                    index: { type: 'index' },
                    name: { label: '课标题' },
                    time_zh: { label: '课时长' },
                    status: {
                        label: '状态',
                        render: (h, text) => `<span class="${text ? 'text-green' : 'text-gray'}">${text ? '启用' : '冻结'}</span>`
                    },
                    // ...this.tableToolbar({
                    //   create: {label: '添加', icon: 'el-icon-plus', header: true},
                    //   edit: {label: '修改', icon: 'el-icon-edit', type: 'primary',},
                    //   exam: {label: '题目', icon: 'el-icon-reading'},
                    //   del: {label: '删除', icon: 'el-icon-delete', type: 'danger',}
                    // }, {width: 200, header: true})
                    ...this.tableToolbar({
                        create: {
                            title: '添加', type: 'primary', size: 'mini', header: true, click: () => {
                                this.$vm.tableHandle({}, 'create')
                            }
                        },
                        edit: {
                            title: '编辑', type: 'text', click: row => {
                                this.$vm.tableHandle(row, 'edit')
                            }
                        },
                        exam: { title: '题目', type: 'text', click: row => { this.exam(row) } },
                        del: {
                            title: '删除', type: 'text', click: row => {
                                this.$vm.tableHandle(row, 'del')
                            }
                        }
                    })
                },
            },
            form: {
                options: { labelPosition: 'top' },
                field: {
                    name: { label: '小课标题', rules: [{ required: true, message: '请填写课标题' }] },
                    time: {
                        label: '课时长', type: 'time-picker', editable: true, format: 'HH:mm:ss', valueFormat: 'HH:mm:ss',
                        value: '00:00:00',
                        selectableRange: '00:00:00 - 08:00:00',
                        pickerFormat: 'HH:mm:ss', rules: [{ required: true, message: '请填写课时长' }]
                    },
                    video_url: { label: '视频地址', rules: [{ required: true, message: '请填写视频地址' }] },
                    status: {
                        label: '状态', type: 'radio', value: 1,
                        sub: [{ name: '启用', value: 1 }, { name: '冻结', value: 0 }],
                        rules: [{ required: true, message: '请选择状态' }]
                    },
                    sort: { label: '排序', type: 'number', value: 0, controls: false, step: 1, stepStrictly: true }
                }
            },
            search: {
                options: { labelPosition: 'right', inline: true, size: 'mini' },
                field: {
                    name: { label: '小课标题' }
                },
            }
        })
    }

    async list (req) {
        let { page, limit } = req
        let { data: { data: { count, rows: data }, course }, code, msg } = await this.$root.$request.post('admin/GetAllSmallCourse', {
            ...this.params(req),
            course_id: this.course_id
        })

        data = data.map(v => {
            v.time_zh = this.$vm.$utils.formatSeconds(v.time)
            v.time = this.$vm.$utils.formatSeconds(v.time, false)
            return v
        })

        course = course.map(v => {
            return { name: v.name, value: v.id }
        })

        return this.result({ table: data, form: { course_id: course }, pagination: { total: count, page, limit } }, code, msg)
    }

    create (req) {
        req.time = this.$vm.$utils.str2Seconds(req.time)
        return this.$root.$request.post('admin/AddSmallCourse', { info: Object.assign(req, { course_id: this.course_id }) })
    }

    edit (req, id, row) {
        if (!this.isEdit(req, row)) {
            return this.result(null, 400, '数据无修改')
        }
        req.time = this.$vm.$utils.str2Seconds(req.time)

        return this.$root.$request.post('admin/EditSmallCourse', { info: { ...req, id, course_id: this.course_id } })
    }

    async del ({ id }) {
        return this.$root.$request.post('admin/DelSmallCourse', { id: id })
    }

    exam (row) {
        // console.log(row)
        this.$vm.$parent.examShow(row)
    }

    async sync ({ id }) {
        return this.$root.$request.post('admin/AutoSetSmallCourse', { id })
    }
}