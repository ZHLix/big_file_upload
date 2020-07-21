<template>
  <div class="manage-container flex flex-wrap">
    <c-table-form api-name="StatisticsClassManage"
                  class="flex-sub"
                  v-if="visible"></c-table-form>
  </div>
</template>

<script>
import CTableForm from '@/components/Template/TableForm'

export default {
    components: { CTableForm },

    data() {
        return {
            visible: false
        }
    },

    created() {
        if (!this.$route.params.class_id) {
            this.$router.back()
        } else {
            this.visible = true
        }
    }
}
</script>

<style lang="scss" scoped>
.manage-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>