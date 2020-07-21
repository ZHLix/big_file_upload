import Base from '../base'

export default class Course extends Base {
    init () {
        return this.result({
            table: {
                options: { size: 'small', pagination: { pageSize: 100, page: 1 } },
                head: {
                    index: { type: 'index' },
                    // image: { label: '图片' },
                    name: { label: '课程名称' },
                    teacher_name: { label: '讲师名' },
                    course_class: {
                        label: '小课管理', render: (h, text, row) => {
                            // const h = this.$vm.$createElement
                            return h('el-button', {
                                attrs: { size: 'mini', type: 'text' },
                                on: { click: () => this.courseClass(row) }
                            }, '管理')
                        }
                    },
                    ...this.tableToolbar({
                        create: {
                            title: '添加', type: 'primary', size: 'mini', header: true, click: () => {
                                // console.log(this.$vm)
                                this.$vm.tableHandle({}, 'create')
                            }
                        },
                        exam: { title: '题目', type: 'text', click: row => { this.exam(row) } },
                        edit: {
                            title: '编辑', type: 'text', click: row => {
                                row = Object.assign({}, row)
                                this.$vm.tableHandle(row, 'edit')
                            }
                        },
                        del: {
                            title: '删除', type: 'text', click: row => {
                                this.$vm.tableHandle(row, 'del')
                            }
                        }
                    })
                }
            },
            form: {
                options: { size: 'small' },
                field: {
                    name: {
                        label: '课程名称',
                        rules: [{ required: true, message: '请填写课程名称' }]
                    },
                    img: {
                        label: '图片',
                        type: 'upload-image',
                        action: 'api/file/upload',
                        previewAction: this.$vm.$store.state.baseUrl,
                        accept: 'image/jpg,image/jpeg,image/png',
                        rules: [{ required: true, message: '请选择图片' }]
                    },
                    teacher_name: {
                        label: '讲师名',
                        rules: [{ required: true, message: '请填写讲师名' }]
                    },
                    teacher_avatar: {
                        label: '讲师头像',
                        type: 'upload-image',
                        action: 'api/file/upload',
                        previewAction: this.$vm.$store.state.baseUrl,
                        accept: 'image/jpg,image/jpeg,image/png',
                        rules: [{ required: true, message: '请填写讲师头像' }]
                    },
                    teacher_content: {
                        label: '讲师描述',
                        type: 'textarea',
                        rules: [{ required: true, message: '请填写讲师描述' }]
                    },
                    content: {
                        label: '课程简介',
                        type: 'editor',
                        options: {
                            height: 600,
                            action: 'api/file/upload',
                            previewAction: this.$vm.$store.state.baseUrl
                        }
                    },
                    course: {
                        label: '课程视频',
                        type: 'upload',
                        value: '',
                        action: '/api/file/upload',
                        tip: '只支持上传mp4类型文件',
                        accept: 'video/mp4',
                        multiple: true,
                        // drag: true,
                        shard: true,
                        // autoUpload: false,
                        fileSize: 200
                    }
                }
            }
        })
    }

    async list (req) {
        let { page, limit } = req
        let { data: { count, rows: data }, code, msg } = await this.$root.$request.post('api/course', this.params(req))
        // return this.$root.$request.get('api/course', this.params(req))
        return this.result({
            table: data,
            form: {},
            pagination: { total: count, page, limit }
        }, code, msg)
    }

    create (req) {
        return this.$root.$request.post('api/course/create', req)
    }


    edit (req, id, row) {
        // console.log(req)
        if (!this.isEdit(req, row)) {
            return this.result(null, 400, '数据无修改')
        }

        return this.$root.$request.post('api/course/edit', { ...req, id })
    }

    async del ({ id }) {
        return this.$root.$request.post('api/course/del', { id: id })
    }


    exam (row) {
        // console.log(row)
        this.$vm.$parent.examShow(row)
    }

    courseClass (row) {
        this.$vm.$parent.classShow(row)
    }
}