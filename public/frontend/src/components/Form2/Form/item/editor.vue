<script>
import CEditor from './extends/editor'

export default {
  components: {CEditor},
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
    return h('CEditor', {
      props: Object.assign({value: this._value}, this.config), on: {
        input: v => {
          if (this.config.readonly) return false

          this.$emit('input', v)
        }
      }
    })
  }
}
</script>