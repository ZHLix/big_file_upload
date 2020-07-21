<script>
import CVideo from './extends/video'

export default {
    components: { CVideo },
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
        return h('c-video', {
            props: Object.assign(
                { action: '' },
                { value: this._value },
                this.config
            ),
            on: {
                input: v => {
                    if (this.config.readonly) return false

                    this.$emit('input', v)
                }
            }
        })
    }
}
</script>