import Base from '../base'
// import Md5 from 'js-md5'

export default class CourseExam extends Base {
    courseApi = null
    course = null
    exam = '[]'

    getExam () {
        try {
            const tmp = JSON.parse(this.exam)
            if (!(tmp instanceof Array)) throw new Error()
            return tmp // JSON.parse(this.exam)
        } catch (e) {
            return []
        }
    }

    init () {
        this.courseApi = this.$vm.$parent.$api[this.$vm.$parent.apiName]
        this.course = this.$vm.$parent.course
        this.exam = this.$vm.$parent.value

        return this.result({
            table: {
                options: { border: true, hideOnSinglePage: true },
                head: {
                    index: { type: 'index' },
                    question: { label: '题目' },
                    options: { label: '选项' },
                    option_right: { label: '正确选项' },
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
                        del: {
                            title: '删除', type: 'text', click: row => {
                                this.$vm.tableHandle(row, 'del')
                            }
                        }
                    })
                }
            },

            form: {
                options: { labelPosition: 'top' },
                field: {
                    id: { type: 'hidden' },
                    question: {
                        label: '题目', rules: [
                            { required: true, message: '必填项不能为空' }
                        ]
                    },
                    options: {
                        label: '选项', type: 'input-add', rules: [
                            { required: true, message: '必填项不能为空' }
                        ]
                    },
                    option_right: {
                        label: '正确选项', rules: [
                            { required: true, message: '必填项不能为空' }
                        ]
                    },
                    tip: {
                        label: '提示', type: 'editor',
                        options: {
                            height: 300,
                            action: '/admin/uploadImg?name=Course',
                            previewAction: this.$vm.$store.state.baseUrl
                        }
                    }
                }
            }
        })
    }

    list () {
        return this.result({ table: this.getExam() })
    }

    async create (req) {
        const exam = this.getExam()

        // eslint-disable-next-line no-undef
        const item = Object.assign({}, req, { id: md5(JSON.stringify(req)) })
        exam.push(item)
        const { code, success, msg } = await this.courseApi.edit(Object.assign({}, this.course, { exam: JSON.stringify(exam) }), this.course.id, Object.assign({}, this.course))
        if (success) {
            this.exam = JSON.stringify(exam)
        }
        return this.result(null, code, msg)
    }

    async edit (req, id, row) {
        if (!this.isEdit(req, row)) {
            return this.result(null, 400, '数据无修改')
        }
        let exam = this.getExam()
        exam = exam.map(v => v.id == id ? req : v)
        const { code, success, msg } = await this.courseApi.edit(Object.assign({}, this.course, { exam: JSON.stringify(exam) }), this.course.id, Object.assign({}, this.course))

        if (success) {
            this.exam = JSON.stringify(exam)
        }
        return this.result(null, code, msg)
    }


    async del ({ id }) {
        let exam = this.getExam()
        exam = exam.filter(v => v.id != id)
        if (!exam.length) {
            exam = null
        }

        const { code, success } = await this.courseApi.edit(Object.assign({}, this.course, { exam: JSON.stringify(exam) }), this.course.id, Object.assign({}, this.course))

        if (success) {
            this.exam = JSON.stringify(exam)
        }
        return this.result(null, code, '删除成功')
    }
}