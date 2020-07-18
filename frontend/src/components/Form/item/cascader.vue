<script>
export default {
    props: {
        value: String | Number | Array,
        config: Object
    },

    computed: {
        _value() {
            let val = this.value
            if (!(val instanceof Array)) {
                val = val ? val.split(',').filter(v => v) : []
            }
            return val
        }
    },

    render(h) {
        return h('el-cascader', {
            props: Object.assign({}, { value: this._value }, this.config, {
                props: Object.assign(
                    { label: 'name', children: 'sub' },
                    this.config.options
                ),
                options: this.config.sub
            }),
            on: {
                input: v => {
                    if (this.config.readonly) return false
                    if (!(this.value instanceof Array)) {
                        v = v.join(',')
                    }
                    this.$emit('input', v)
                }
            },
            nativeOn: {
                keydown: e => {
                    // 阻止 事件冒泡
                    e.stopPropagation()
                    // 阻止该元素默认的 keyup 事件
                    e.preventDefault()
                }
            }
        })
    }
}
</script>