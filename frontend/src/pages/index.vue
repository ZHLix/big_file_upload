<template>
  <div class="container cu-card">
    <div class="cu-item">
      <div class="cu-bar title padding-lr text-blue">
        <div>
          <span class="cuIcon-titles"></span>
          <span>上传大文件</span>
        </div>
      </div>

      <div class="content padding-lr">
        <c-form :fields="form.fields"
                :config="{size: 'mini', labelPosition: 'right', labelWidth: '100px'}"></c-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                fields: {
                    name: { label: '姓名' },
                    image: {
                        label: '图片',
                        type: 'upload',
                        action: 'index/index', // 'http://localhost:8001',
                        tip: '只支持上传video类型文件',
                        accept: 'video/mp4',
                        multiple: true,
                        // drag: true,
                        // autoUpload: false,
                        fileSize: 200
                    }
                }
            }
        }
    },

    created() {
        console.log(this.$api.$request.getConfig('headers')['post'])
    }
}
</script>

<style>
</style>