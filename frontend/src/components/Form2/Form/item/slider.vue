<script>
export default {
  props: {
    value: String | Number | Array,
    config: Object
  },

  computed: {
    _value() {
      let tmp = this.value
      if (tmp instanceof Array) {
        tmp = tmp.split(',').map(v => Number(v))
      } else if (typeof tmp == 'string') {
        tmp = Number(tmp)
      }
      return tmp
    }
  },

  render(h) {
    return h('el-slider', {
      props: Object.assign({value: this._value}, this.config),
      on: {
        input: v => {
          if (this.config.readonly) return false

          if (this.value instanceof Array) {
            v = v.join(',')
          }
          this.$emit('input', v)
        }
      }
    })
  }
}
</script>