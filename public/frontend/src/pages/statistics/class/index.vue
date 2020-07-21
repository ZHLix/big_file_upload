<template>
  <div class="container">
    <c-table-form ref="tableForm"
                  api-name="StatisticsClass"></c-table-form>
  </div>
</template>

<script>
import CTableForm from '@/components/Template/TableForm'
export default {
    components: { CTableForm }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>