<template>
  <div class="table-container cu-card flex flex-direction">
    <div class="cu-item padding-top padding-lr margin-0 margin-bottom bg-white"
         v-if="$scopedSlots.search">
      <slot name="search"></slot>
    </div>
    <div class="cu-item padding margin-0 bg-white flex-sub">
      <table-table v-model="value"
                   :fields="headOptions"
                   :config="tableOptions" @pagination="onPagination"></table-table>
    </div>
  </div>
</template>

<script>
import TableTable from './Table'
export default {
  components: { TableTable },

  /**
   * 插槽
   */
  props: {
    /**
     * 表格数据
     */
    value: Array,
    /**
     * 表格配置
     */
    tableOptions: Object,
    /**
     * 表列配置
     */
    headOptions: Object,

    /**
     * 分页回调
     */
    onPagination: Function
  }
}
</script>


<style scoped lang="scss">
.table-container {
  height: 100%;
}
</style>