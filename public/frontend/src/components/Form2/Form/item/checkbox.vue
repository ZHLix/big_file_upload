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
    return h(
      'el-checkbox-group',
      {
        props: Object.assign({value: this._value}, this.config),
        on: {
          input: v => {
            if (this.config.readonly) return false

            if (!(this.value instanceof Array)) {
              v = v.join(',')
            }
            this.$emit('input', v)
          }
        }
      },
      this.config.sub.map(v =>
        h('el-checkbox', {props: {label: v.value}}, v.name)
      )
    )
  }
}
</script>