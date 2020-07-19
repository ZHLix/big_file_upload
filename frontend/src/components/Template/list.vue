<script>
export default {
    props: {
        /**
         * api
         */
        api: String,
        /**
         * 字段
         */
        tableFields: {
            type: Object,
            default: () => ({})
        },
        formFields: {
            type: Object,
            default: () => ({})
        },
        /**
         * 设置
         */
        tableConfig: {
            type: Object,
            default: () => ({})
        },
        formConfig: {
            type: Object,
            default: () => ({})
        },

        /**
         * 操作栏
         */
        tableAction: Boolean
    },

    data() {
        return {
            /**
             * 表格数据
             */
            table: [],
            /**
             * 表单数据
             */
            form: {},
            visible: false
        }
    },

    computed: {
        _api() {
            const api = this.api ? this.$api[this.api] : {}
            return api
        },
        _tableFields() {
            console.log(this._api, this.tableAction)
            return Object.assign(
                this.tableFields,
                this.tableAction ? this._api.tableToolbar(this) : {}
            )
        }
    },

    methods: {
        tableHandle(row, handle = 'create') {
            console.log(row, handle)
        }
    },

    render(h) {
        return h('div', { class: 'flex-sub' }, [
            // 搜索
            h('div', { class: 'search' }),
            // 表格
            h('c-table', {
                props: {
                    value: this.table,
                    fields: this._tableFields,
                    config: this.tableConfig
                }
            }),
            h(
                'el-dialog',
                {
                    props: {
                        visible: this.visible,
                        closeOnClickModal: false,
                        appendToBody: true
                    }
                },
                [
                    h('c-form', {
                        props: {
                            value: this.form,
                            fields: this.formFields,
                            config: this.formConfig
                        }
                    })
                ]
            )
        ])
    }
}
</script>

<style>
</style>