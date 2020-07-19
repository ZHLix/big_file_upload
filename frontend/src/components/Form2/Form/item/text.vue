<script>
export default {
  props: {value: String | Number, config: Object},

  render(h) {
    return h('el-input', {
      props: Object.assign({value: this.value}, this.config),
      on: {
        input: v => {
          if (this.config.readonly) return false
          this.$emit('input', v)
        }
      },
      nativeOn: {
        submit: v => console.log(v)
      }
    })
  }
}
</script>

<style>
</style>