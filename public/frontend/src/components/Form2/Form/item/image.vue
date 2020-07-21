<script>
import CImage from './extends/image'

export default {
  components: {CImage},
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
    return h('c-image', {
      props: Object.assign({action: ''}, {value: this._value}, this.config),
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