<script>
import CAdd from './extends/inputAdd'

export default {
    components: { CAdd },
    props: {
        value: String,
        config: Object
    },

    computed: {
        _value() {
            let tmp = this.value
            return tmp
        }
    },

    render(h) {
        return h('CAdd', {
            props: Object.assign({ value: this._value }, this.config),
            on: {
                input: v => {
                    if (this.config.readonly) return false

                    this.$emit('input', v)
                }
            },
            nativeOn: {
                keydown: e => {
                    if (e.key === 'Enter') {
                        // 阻止 事件冒泡
                        e.stopPropagation()
                        // 阻止该元素默认的 keyup 事件
                        e.preventDefault()
                    }
                }
            }
        })
    }
}
</script>