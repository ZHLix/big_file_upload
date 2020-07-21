<script>
export default {
  props: {
    value : Number | String,
    config: Object
  },

  computed: {
    _value() {
      let tmp = this.value
      if (typeof tmp == 'string') {
        tmp = Number(tmp)
      }
      if (!tmp && this.config.min) {
        this.$emit('input', this.config.min)
      }
      return tmp
    }
  },

  render(h) {
    return h('el-input-number', {
      props: Object.assign({value: this._value}, this.config),
      on   : {
        input: v => {
          // console.log(v)
          if (this.config.readonly) return false
          // console.log(v)
          if (typeof v == 'string') {
            v = String(v)
          }
          this.$emit('input', v)
        }
      }
    })
  }
}
</script>