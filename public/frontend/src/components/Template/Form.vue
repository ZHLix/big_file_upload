<template>
  <div class="container cu-card"
       v-loading.lock="!initing">

    <div :class="['cu-item margin-0 bg-white', form.attrs.options && form.attrs.options.inline ? 'padding-lr padding-top' : 'padding']">
      <c-form2 ref="form"
              v-if="form.visible"
              v-model="form.data"
              :form-options="form.attrs.options"
              :field-options="form.attrs.field"
              submit-btn
              :submit-btn-loading="form.loading"
              :on-success="formHandle"
              :on-reset="reset"></c-form2>
    </div>
  </div>
</template>

<script>
import CForm2 from '../Form2'
export default {
    components: {CForm2},
    props: {
        apiName: String,

        reset: Function
    },

    data() {
        return {
            api: null,
            /**
             * 初始化状态
             */
            initing: false,

            form: {
                visible: false,
                type: 'edit',
                loading: false,
                attrs: {},
                data: {}
            }
        }
    },

    methods: {
        async init() {
            let {
                data: { form }
            } = await this.api.init()

            this.form.attrs = form

            this.select()

            this.initing = true
        },

        /**
         * 查询数据
         */
        async select() {
            this.form.loading = true
            let { data, success, msg } = await this.api.list()

            if (!success) {
                this.$message.error(msg)
                return false
            }
            this.form.data = data
            this.form.loading = false
            this.form.visible = true
        },

        async formHandle(data) {
            let type = this.form.type

            this.form.loading = true
            let { success, msg } = await this.api[type](
                data,
                this.form.data.id,
                this.form.data
            )
            this.$message[success ? 'success' : 'error'](msg)
            this.select()
            this.form.loading = false
        }
    },

    created() {
        this.api = this.$api[this.apiName]
        this.api.bind(this)
        this.api && this.init()
    }
}
</script>

<style scoped lang="scss">
.container {
  height: 100%;

  & > .cu-item {
    min-height: 100%;
  }
}
</style>