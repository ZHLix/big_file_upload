<template>
  <div class="cu-card flex-sub flex flex-direction">
    <div class="cu-tiem bg-white flex-sub padding">
      <c-table :fields="table.fields"
               :config="{size: 'small'}"></c-table>

      <el-dialog :visible.sync="dialog.visible"
                 :title="dialog.name"
                 append-to-body
                 :close-on-click-modal="false">
        <c-form ref="form"
                :fields="form.fields"
                :config="{size: 'small'}"></c-form>
        <div class="flex flex-wrap justify-end align-center">
          <el-button size="small"
                     type="primary"
                     :loading="dialog.loading"
                     @click="submit">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            table: {
                fields: {
                    index: { type: 'index' },
                    image: { label: '图片' },
                    name: { label: '课程名称' },
                    teacher_name: { label: '讲师名' },
                    ...this.$api.Course.tableToolbar(this)
                }
            },
            form: {
                fields: {
                    name: {
                        label: '课程名称',
                        rules: [{ required: true, message: '请填写课程名称' }]
                    },
                    img: {
                        label: '图片',
                        type: 'upload-image',
                        action: 'api/file/upload',
                        previewAction: this.$store.state.baseUrl,
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
                        previewAction: this.$store.state.baseUrl,
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
                            previewAction: this.$store.state.baseUrl
                        }
                    }
                }
            },

            dialog: {
                name: '添加',
                visible: false,
                data: {},
                handle: 'create',
                loading: false
            }
        }
    },

    watch: {
        'dialog.visible'(v) {
            if (!v) {
                this.dialog.data = {}
            }
        }
    },

    methods: {
        /**
         * 初始化
         */
        async init() {
            const res = await this.$api.Course.list()
            console.log(res)
        },

        /**
         * 表格操作行为
         */
        tableHandle(row, handle = 'create') {
            if (handle == 'del') {
                this.tableDel(row)
            } else {
                this.dialog.name = handle == 'create' ? '添加' : '修改'
                this.dialog.handle = handle
                this.dialog.data = row
                this.dialog.visible = true
                console.log(this.dialog)
            }
        },

        /**
         * 表格删除行为
         */
        tableDel(row) {
            console.log(row)
        },

        async submit() {
            const data = await this.$refs.form.validate()
            this.dialog.loading = true
            const res = await this.$api.Course[this.dialog.handle](
                data,
                this.dialog.data
            ).catch(err => console.log(err))
            this.dialog.loading = false
            if (res.code !== 200) {
                this.$message.error(res.msg)
                return false
            }
            this.$message.success(res.msg)

            this.dialog.visible = false
        }
    },

    created() {
        this.init()
    }
}
</script>

<style>
</style>