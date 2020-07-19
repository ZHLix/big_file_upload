<template>
  <div :class="formOptions.inline ? 'flex flex-wrap align-start' : ''">
    <c-form2 ref="form"
             :class="formOptions.inline ? 'flex-sub' : ''"
             v-model="value"
             :fields="FormFieldOptions"
             :validator="FormFormOptions.validator"
             :config="FormFormOptions"
             @reset="reset"
             @submit="submit"></c-form2>

    <div :class="submitGroupClass"
         :style="{marginLeft: formOptions.inline || formOptions.labelPosition === 'top' ? '' : (formOptions.labelWidth || '80px')}"
         v-show="submitBtn || resetBtn">
      <el-button v-if="submitBtn"
                 :class="submitBtnClass"
                 :size="formOptions.size"
                 type="primary"
                 :loading="submitBtnLoading"
                 :disabled="formOptions.disabled || formOptions.readonly"
                 :icon="submitBtnIcon"
                 @click="doSubmit">提交
      </el-button>

      <el-button v-if="resetBtn"
                 :class="resetBtnClass"
                 :size="formOptions.size"
                 :disabled="formOptions.disabled"
                 :icon="resetBtnIcon"
                 @click="doReset">重置
      </el-button>
    </div>
  </div>
</template>

<script>
import CForm2 from '../Form'

export default {
    components: { CForm2 },
    props: {
        /**
         * 数据列表
         */
        value: Object,

        /**
         * 表单配置
         */
        formOptions: Object,

        /**
         * 表单子元素配置
         */
        fieldOptions: Object,

        /**
         * 启用场景
         */
        scene: String,

        /**
         * 场景配置
         */
        sceneOptions: Object,

        /**
         * 提交函数
         */
        onSuccess: Function,

        onReset: Function,

        submitGroupClass: String,

        /**
         * 表单提交按钮
         */
        submitBtn: Boolean,

        /**
         * 表单提交按钮图标
         */
        submitBtnIcon: String,

        /**
         * 表单提交按钮加载中切换控制
         */
        submitBtnLoading: Boolean,

        /**
         * 表单提交按钮样式
         */
        submitBtnClass: String,

        /**
         * 重置表单按钮
         */
        resetBtn: Boolean,

        /**
         * 表单提交按钮图标
         */
        resetBtnIcon: String,

        /**
         * 表单提交按钮样式
         */
        resetBtnClass: String
    },

    data() {
        return {
            FormFormOptions: {},
            FormFieldOptions: {}
        }
    },

    methods: {
        doReset() {
            this.$refs.form.doReset()
        },
        doSubmit() {
            this.$refs.form.doSubmit()
        },
        reset() {
            if (!this.onReset) {
                this.submit()
            } else {
                this.onReset()
            }
        },

        /**
         * 验证
         */
        validate() {
            return this.$refs.form.validate()
        },

        /**
         * 提交
         */
        async submit(data) {
            if (!this.submitBtnLoading) {
                this.onSuccess && this.onSuccess(data)
            }
        },

        setConfig(data) {
            this.FormFormOptions = Object.assign({}, this.FormFormOptions, data)
        },

        setField(data) {
            this.FormFieldOptions = Object.assign(
                {},
                this.FormFieldOptions,
                data
            )
        }
    },

    created() {
        this.FormFormOptions = this.formOptions
        this.FormFieldOptions = this.fieldOptions
    }
}
</script>