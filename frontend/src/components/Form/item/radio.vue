<script>
export default {
    props: {
        value: String | Number,
        config: Object
    },

    render(h) {
        return h(
            'el-radio-group',
            {
                props: Object.assign({ value: this.value }, this.config),
                on: {
                    input: v => {
                        if (this.config.readonly) return false

                        this.$emit('input', v)
                    }
                }
            },
            this.config.sub.map(v =>
                h('el-radio', { props: { label: v.value } }, v.name)
            )
        )
    }
}
</script>