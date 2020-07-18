<script>
export default {
    props: {
        value: Boolean | String | Number,
        config: Object
    },

    computed: {
        _value() {
            let v = this.value
            if (v === '') v = false
            return v ?? false
        }
    },

    render(h) {
        return h('el-switch', {
            props: Object.assign({ value: this._value }, this.config),
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