<!--
 * @Date: 2020-04-07 13:54:24
 * @LastEditors: zhlix <15127441165@163.com>
 * @LastEditTime: 2020-04-14 17:06:28
 * @FilePath: \frozen_food_mall\src\components\Form\image.vue
 -->
<template>
  <div class="image-container">

    <!--预览列表-->
    <div class="preview-list">

      <!--图片元素-->
      <div class="image-item"
           :disabled="disabled"
           v-for="(item, key) in images"
           :key="key">
        <!--删除图标-->
        <div class="remove cuIcon-close text-sm text-white round"
             @click="remove(key)"></div>

        <el-image class="cu-avatar xl radius bg-white shadow margin-right-sm margin-bottom-sm"
                  fit="cover"
                  :src="[previewAction, item].join('/')"
                  :preview-src-list="previewImages">
          <div slot="error"
               class="image-slot text-gray text-xl"><i class="el-icon-picture-outline"></i></div>
        </el-image>

      </div>

      <el-upload class="upload"
                 ref="upload"
                 :show-file-list="false"
                 :disabled="disabled"
                 :action="action"
                 :multiple="multiple"
                 :name="name"
                 :accept="accept"
                 :limit="limit"
                 :before-upload="beforeUpload"
                 :http-request="upload">
        <div class="cu-avatar xl bg-white shadow radius margin-right-sm margin-bottom-sm"
             slot="trigger"
             v-if="images.length < limit"><i class="cuIcon-add text-gray text-xl"></i></div>
      </el-upload>

    </div>

  </div>
</template>

<script>
export default {
    name: 'upload-image',

    /**
     * 属性插槽
     */
    props: {
        value: {
            // type: String | Array,
            default: ''
        },
        /**
         * 是否禁用
         */
        disabled: Boolean,
        /**
         * 必选参数，上传的地址
         */
        action: String,
        /**
         * 预览基础地址
         */
        previewAction: String,
        /**
         * 是否支持多选文件
         */
        multiple: Boolean,
        /**
         * 上传的文件字段名
         */
        name: {
            type: String,
            default: 'file'
        },
        /**
         * 接受上传的文件类型
         */
        accept: {
            type: String,
            default: 'file/*'
        },
        fileSize: {
            type: Number,
            default: 2
        },
        /**
         * 最大允许上传个数
         */
        limit: {
            type: Number,
            default: 1
        }
    },

    /**
     * 计算
     */
    computed: {
        /**
         * 图片数据
         */
        images: {
            get() {
                let value = this.value
                if (this.valueType === 'string') {
                    value = value.split(',').filter(val => val)
                }
                return value
            },
            set(val) {
                if (this.valueType === 'string') val = val.join(',')
                this.$emit('input', val)
            }
        },

        previewImages() {
            return this.images.map(v => {
                return [this.previewAction, v].join('/')
            })
        },

        /**
         * 传入的value原始类型 string | array
         */
        valueType() {
            return typeof this.value
        }
    },

    /**
     * 数据
     */
    data() {
        return {}
    },

    /**
     * 方法
     */
    methods: {
        /**
         * 上传前回调
         */
        beforeUpload(file) {
            try {
                let imgTypeObj = {}
                this.accept
                    .split(',')
                    .filter(v => v)
                    .forEach(v => {
                        let tmp = v.split('/')
                        if (!imgTypeObj?.[tmp[0]]) imgTypeObj[tmp[0]] = []

                        if (imgTypeObj[tmp[0]].indexOf('*') === -1) {
                            imgTypeObj[tmp[0]] = [...imgTypeObj[tmp[0]], tmp[1]]
                        } else {
                            imgTypeObj[tmp[0]] = [tmp[1]]
                        }
                    })
                let fileType = file.type.split('/')

                if (Object.keys(imgTypeObj).indexOf(fileType[0]) === -1) {
                    throw new Error(
                        `不允许上传非${Object.keys(imgTypeObj).join(',')}文件!`
                    )
                }

                if (imgTypeObj[fileType[0]].indexOf('*') === -1) {
                    if (imgTypeObj[fileType[0]].indexOf(fileType[1]) === -1) {
                        throw new Error(
                            `只允许上传${this.accept.join(',')}文件`
                        )
                    }
                }

                // if (!isImage) throw new Error('不允许上传非图片文件!')

                if (file.size / 1024 / 1024 > this.fileSize) {
                    throw new Error(`上传视频大小不能超过${this.fileSize}MB!`)
                }

                return true
            } catch (e) {
                this.$message.error(e.message)
                this.$refs.upload.uploadFiles = []
                return false
            }
        },
        /**
         * 自定义上传方法
         */
        // async upload({file, filename, action}) {
        async upload({ file, filename }) {
            let formData = new FormData()
            formData.append(filename, file)

            let res = await this.$api.User.$root.$request.post(
                this.action,
                formData
            )

            if (res.success) {
                this.images = [...this.images, res.data.file_name].filter(
                    val => val
                )
            } else {
                // 通知消息
                this.$message[res.success ? 'success' : 'error'](res.msg)
            }
            this.$refs.upload.uploadFiles = []
        },
        /**
         * 删除图片回调
         */
        remove(key) {
            this.images = this.images.filter((val, index) => index !== key)
        }
    }
}
</script>

<style scoped
       lang="scss">
.upload {
  display: inline-block;
}

.image-item {
  position: relative;
  display: inline-block;

  .remove {
    width: 17px;
    height: 17px;
    line-height: initial;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(0%, -50%);
    background-color: rgba(0, 0, 0, 0.3);
    cursor: pointer;
    z-index: 1;
    padding: 2px;
    display: none;
  }

  &:not([disabled]):hover {
    .remove {
      display: block;
    }
  }
}
</style>