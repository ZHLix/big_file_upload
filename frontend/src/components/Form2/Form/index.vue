<template>
  <div class="form-container">
    <c-form-container v-model="value"
                      ref="form"
                      :fields="_fields"
                      :config="_config"
                      :validator="_validator"
                      @reset="reset"
                      @submit="submit"></c-form-container>
  </div>
</template>

<script>
import CFormContainer from './form'

export default {
  components: {CFormContainer},
  props: {
    value: Object || null || undefined,
    fields: Object,
    config: Object,
    validator: Object
  },

  computed: {
    _fields() {
      return this.fields
    },
    _config() {
      return Object.assign({labelWidth: '80px'}, this.config)
    },
    _validator() {
      return this.validator
    }
  },

  methods: {
    doReset() {
      this.$refs.form.reset()
    },
    doSubmit() {
      this.$refs.form.submit()
    },

    /**
     * 验证
     */
    validate() {
      return this.$refs.form.validate()
    },
    
    reset() {
      this.$emit('reset')
    },
    submit(data) {
      this.$emit('submit', data)
    }
  }
}
</script>

<style>
</style>