<script>
export default {
    props: {
        value: Array,
        fields: Object,
        config: Object
    },

    computed: {
        _fields() {
            const item = arr => {
                return Object.keys(arr).map(k => {
                    const child = Object.assign({}, arr[k])
                    if (child.sub) {
                        child.sub = item(child.sub)
                    }
                    return Object.assign({ prop: k }, child)
                })
            }
            return item(this.fields)
        },
        _config() {
            return Object.assign({}, this.config)
        }
    },

    render(h) {
        const item = arr => {
            return arr.map(v => {
                const val = []
                const scopedSlots = {}
                if (v.sub) {
                    val.push(item(v.sub))
                }
                if (v.header) {
                    scopedSlots.header = props => v.header(h, props)
                }

                if (v.actions) {
                    scopedSlots.default = props => v.actions(h, props)
                }

                if (v.render) {
                    scopedSlots.default = ({ row, column }) => {
                        const tmp = v.render(h, row[column?.property], row)
                        if (this.isVNode(tmp)) {
                            return tmp
                        } else {
                            return h('div', { domProps: { innerHTML: tmp } })
                        }
                    }
                }
                return h(
                    'el-table-column',
                    {
                        props: Object.assign(
                            {},
                            { minWidth: this._config.minWidth },
                            v
                        ),
                        scopedSlots
                    },
                    val
                )
            })
        }
        return h(
            'el-table',
            {
                props: Object.assign(
                    {
                        height: this._config.pagination
                            ? 'calc(100% - 32px)'
                            : 'calc(100%)'
                    },
                    { data: this.value },
                    this.config
                )
            },
            item(this._fields)
        )
    },

    methods: {
        isVNode(v) {
            // 获取 vnode 实例
            let vnode = this.$createElement('span', '')

            // VNode 构造函数
            let VNode = vnode.constructor

            // 所以通过 obj instanceof VNode 即可判断
            const isVNode = obj => obj instanceof VNode
            return isVNode(v)
        }
    }
}
</script>