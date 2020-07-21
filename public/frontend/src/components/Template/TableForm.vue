<template>
  <div class="container"
       :style="{height}">

    <c-table2 v-if="table.attrs.head"
              v-loading="table.loading"
              v-model="table.data"
              ref="table"
              :table-options="table.attrs.options"
              :head-options="table.attrs.head"
              :on-pagination="paginationHandle">

      <c-form2 slot="search"
               v-if="table.search.attrs.field"
               ref="search"
               :form-options="table.search.attrs.options"
               :field-options="table.search.attrs.field"
               reset-btn
               submit-btn
               submit-group-class=""
               @change="searchChange"
               :on-success="searchHandle"></c-form2>

    </c-table2>

    <el-dialog v-if="initing"
               :close-on-click-modal="false"
               append-to-body
               :visible.sync="form.visible">

      <c-form2 v-if="form.visible"
               v-model="form.data"
               ref="form"
               :form-options="form.attrs.options"
               :field-options="form.attrs.field"
               :scene="form.type"
               :scene-options="form.attrs.scene"
               submit-btn
               :submit-btn-loading="form.loading"
               @change="formChange"
               :on-success="formHandle"></c-form2>

    </el-dialog>

  </div>
</template>

<script>
import CTable2 from '../Table2'
import CForm2 from '../Form2'
export default {
    components: { CTable2, CForm2 },
    props: {
        apiName: String,
        height: {
            type: String,
            default: '100% !important'
        }
    },

    data() {
        return {
            initing: false,
            table: {
                loading: false,
                attrs: {},
                data: [],
                search: { attrs: {}, data: [] }
            },
            form: {
                visible: false,
                loading: false,
                attrs: {},
                attrs_backup: {},
                data: [],
                type: 'create'
            }
        }
    },

    watch: {
        'form.visible'(v) {
            if (!v) {
                this.form.loading = false
            }
        }
    },

    methods: {
        async init() {
            let {
                data: { table, form, search }
            } = await this.api.init()

            this.table.attrs = table
            this.form.attrs = form
            search && (this.table.search.attrs = search)

            this.select()

            this.initing = true
        },

        /**
         * 查询数据
         */
        async select() {
            this.table.loading = true
            let {
                data: { table, form, pagination },
                success,
                msg
            } = await this.api.list(
                {
                    page: this.table.attrs.options.pagination?.page,
                    limit: this.table.attrs.options.pagination?.pageSize,
                    search: this.table.search.data
                },
                this.$route.query
            )
            this.table.loading = false

            if (!success) {
                this.$message.error(msg)
                return false
            }

            this.table.data = table
            if (pagination) {
                const { total, page, limit } = pagination
                this.table.attrs.options = Object.assign(
                    this.table.attrs.options,
                    {
                        pagination: {
                            total,
                            page,
                            pageSize: limit
                        }
                    }
                )
            }

            form &&
                Object.keys(form).forEach(k => {
                    if (this.form.attrs?.field && this.form.attrs.field[k]) {
                        this.form.attrs.field[k].sub = form[k]
                    }
                    if (
                        this.table.search.attrs?.field &&
                        this.table.search.attrs.field[k]
                    ) {
                        this.table.search.attrs.field[k].sub = form[k]
                    }
                })
        },

        tableHandle(row = {}, type = 'create', fields = {}, config = {}) {
            if (type === 'del') {
                this.formDelHandle(row)
                return false
            } else if (type === 'create' || type === 'edit') {
                this.form.attrs_backup = Object.assign({}, this.form.attrs)
                Object.keys(fields).forEach(k => {
                    const tmp = fields[k]
                    this.form.attrs.field[k] = Object.assign(
                        this.form.attrs.field[k],
                        tmp
                    )
                })
                this.form.attrs.options = Object.assign(
                    this.form.attrs.options,
                    config
                )
                this.form.type = type
                this.form.data = row
                this.form.visible = true
            } else {
                this.api[type](row)
            }
        },

        /**
         * 表单操作函数
         */
        async formHandle(data) {
            let type = this.form.type

            this.form.loading = true
            let { success, msg } = await this.api[type](
                data,
                this.form.data.id,
                this.form.data,
                this.$route.query
            )
            this.$message[success ? 'success' : 'error'](msg)
            if (!success) {
                this.form.loading = false
                return false
            }

            this.form.attrs = Object.assign({}, this.form.attrs_backup)
            this.select()
            this.form.visible = false
            this.form.loading = false
        },

        formChange(value, key, form) {
            if (!this.form.attrs.field[key].change) {
                return false
            }
            let res = this.form.attrs.field[key].change(value, form)

            res &&
                Object.keys(res).forEach(k => {
                    if (this.form.attrs?.field && this.form.attrs.field[k]) {
                        this.form.attrs.field[k].sub = form[k]
                    }
                })
        },

        formDelHandle(row) {
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    let { success, msg } = await this.api.del(row)
                    this.$message[success ? 'success' : 'error'](msg)
                    this.select()
                })
                .catch(() => {
                    this.$message.info('已取消删除')
                })
        },

        paginationHandle({ page, limit }) {
            // if (type === 'size') {
            //   this.table.attrs.options.pagination.pageSize = data
            //   this.table.attrs.options.pagination.page = 1
            //   this.table.attrs.options = Object.assign(this.table.attrs.options, {pagination: {pageSize: data, page: 1}})
            // } else if (type === 'current') {
            //   this.table.attrs.options.pagination.page = data
            // }
            this.table.attrs.options = Object.assign(this.table.attrs.options, {
                pagination: {
                    total: this.table.attrs.options.pagination.total,
                    pageSize: limit,
                    page
                }
            })
            this.select()
        },

        searchHandle(data) {
            this.table.search.data = data
            this.table.attrs.options.pagination.page = 1
            this.select()
        },
        searchChange(value, key, form) {
            if (!this.table.search.attrs.field[key].change) {
                return false
            }
            let res = this.table.search.attrs.field[key].change(value, form)

            res &&
                Object.keys(res).forEach(k => {
                    // if (this.form.attrs?.field && this.form.attrs.field[k]) {
                    //   this.form.attrs.field[k].sub = form[k]
                    // }
                    if (
                        this.table.search.attrs?.field &&
                        this.table.search.attrs.field[k]
                    ) {
                        this.table.search.attrs.field[k].sub = res[k]
                    }
                })
        }
    },

    created() {
        this.api = this.$api[this.apiName]
        this.api.bind(this)
        this.api && this.init()
    }
}
</script>