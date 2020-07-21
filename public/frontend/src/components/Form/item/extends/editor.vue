<!--
 * @Date: 2020-04-08 20:38:51
 * @LastEditors: zhlix <15127441165@163.com>
 * @LastEditTime: 2020-04-14 18:11:30
 * @FilePath: \frozen_food_mall\src\components\Form\editor.vue
 -->
<template>
  <div class="editor-container">
    <tinymce-editor v-model="_value"
                    :init="_options"
                    :disabled="disabled"></tinymce-editor>
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import tinymceEditor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver/theme'
import 'tinymce/plugins/image'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/code'

tinymce.baseURL = '/public/static/tinymce'
tinymce.documentBaseURL = '/'
export default {
    /**
     * 组件
     */
    components: { tinymceEditor },
    /**
     * 组件属性插槽
     */
    props: {
        /**
         * 数据值
         */
        value: String,

        /**
         * 相关配置
         */
        options: Object,

        disabled: Boolean
    },

    /**
     * 计算
     */
    computed: {
        /**
         * 数据值
         */
        _value: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        },

        _options() {
            let tmp = Object.assign({}, this.options)
            return {
                plugins: tmp.plugins ?? 'lists image table wordcount code',

                toolbar:
                    tmp.toolbar ??
                    'undo redo |  formatselect fontsizeselect fontselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image  table | removeformat | code',

                height: tmp.height ?? undefined,

                width: tmp.width ?? undefined,

                disabled: tmp.disabled ?? false,

                relative_urls: tmp.relativeUrls ?? false,

                remove_script_host: tmp.removeScriptHost ?? false,

                language: tmp.language ?? 'zh_CN',

                font_formats:
                    tmp.fontFormats ??
                    '微软雅黑="微软雅黑";宋体="宋体";黑体="黑体";仿宋="仿宋";楷体="楷体";隶书="隶书";幼圆="幼圆";Arial="Arial";',

                fontsize_formats:
                    tmp.fontsizeFormats ??
                    '14px 15px 16px 17px 18px 19px 20px 21px 22px 23px 24px 25px 26px 27px 28px 29px 30px 32px 48px',

                branding: tmp.branding ?? false,

                menubar: tmp.menubar ?? false,

                images_upload_handler:
                    tmp.imagesUploadHandler ?? this.imagesUploadHandler,

                action: tmp.action ?? '/images',
                previewAction: tmp.previewAction ?? '/images'
            }
        }
    },

    /**
     * 方法
     */
    methods: {
        async imagesUploadHandler(blobInfo, success, failure) {
            let fileObj = new FormData()
            fileObj.append('file', blobInfo.blob())
            let res = await this.$api.User.$root.$request.post(
                this._options.action,
                fileObj
            )
            if (res.success) {
                success(
                    [this._options.previewAction, res.data.file_name].join('/')
                )
            } else {
                this.$message.error(res.msg)
                failure(res.msg)
            }
        }
    }
}
</script>

<style>
</style>