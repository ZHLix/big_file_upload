<script>
export default {
  props: {
    value: String | Array,
    config: Object
  },

  computed: {
    _value() {
      let tmp = this.value
      return tmp
    }
  },

  render(h) {
    return h('el-time-picker', {
      props: Object.assign(
        { valueFormat: 'HH:mm:ss' },
        { value: this._value },
        this.config
      ),
      on: {
        input: v => {
          if(this.config.readonly) return false
          this.$emit('input', v)
        }
      }
    })
  }
}
</script>