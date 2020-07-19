<script>
export default {
  props: {
    value: String | Array,
    config: Object
  },

  data() {
    return {
      valueFormat: {
        date: 'yyyy-MM-dd',
        daterange: 'yyyy-MM-dd',
        datetime: 'yyyy-MM-dd HH:mm:ss',
        datetimerange: 'yyyy-MM-dd HH:mm:ss'
      }
    }
  },

  computed: {
    _sep() {
      return this.config.separator ?? '~'
    },
    _value() {
      let tmp = this.value
      if (
        typeof tmp == 'string' &&
        ['daterange', 'datetimerange'].findIndex(v => v == this.config.type) !==
        -1
      ) {
        tmp = tmp.split(this._sep)
      }
      return tmp
    }
  },

  render(h) {
    return h('el-date-picker', {
      props: Object.assign(
        {valueFormat: this.valueFormat[this.config.type]},
        {value: this._value},
        this.config
      ),
      on: {
        input: v => {
          if (this.config.readonly) return false

          if (
            typeof this.value == 'string' &&
            ['daterange', 'datetimerange'].findIndex(
              v2 => v2 == this.config.type
            ) !== -1
          ) {
            v = v.join(this._sep)
          }
          console.log(v)
          this.$emit('input', v)
        }
      }
    })
  }
}
</script>