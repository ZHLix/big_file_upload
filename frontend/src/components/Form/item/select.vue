<script>
export default {
    props: {
        value: String | Number | Array,
        config: Object
    },

    computed: {
        _value() {
            let val = this.value
            if (this.config.multiple && !(val instanceof Array)) {
                val = val ? val.split(',').filter(v => v) : []
            }
            return val
        }
    },

    render(h) {
        const item = arr => {
            return arr.map(v => {
                let elemName = 'el-option'
                const tmp = []
                if (v.sub) {
                    elemName += '-group'
                    tmp.push(
                        h(elemName, { props: { label: v.name } }, item(v.sub))
                    )
                } else {
                    tmp.push(
                        h(elemName, {
                            props: { label: v.name, value: v.value }
                        })
                    )
                }
                return tmp
            })
        }
        return h(
            'el-select',
            {
                props: Object.assign({ value: this._value }, this.config),
                on: {
                    input: v => {
                        if (this.config.readonly) return false

                        if (
                            this.config.multiple &&
                            !(this.value instanceof Array)
                        ) {
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
            },
            item(this.config.sub)
        )
    }
}
</script>