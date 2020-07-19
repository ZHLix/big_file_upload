<template>
  <div class="table-wrapper flex flex-direction">
    <table-table v-model="value"
                 :fields="fields"
                 :config="config"></table-table>
    <table-pagination v-model="config.pagination.page"
                      :config="config.pagination"
                      v-if="config.pagination"
                      @pagination="paginationHandle"></table-pagination>
  </div>
</template>

<script>
import TableTable from './table'
import TablePagination from './pagination'
export default {
    components: { TableTable, TablePagination },
    props: {
        value: Array,
        fields: Object,
        config: Object
    },

    methods: {
        paginationHandle(e) {
            this.$emit('pagination', e)
        }
    }
}
</script>

<style lang="scss" scoped>
.table-wrapper {
  width: 100%;
  height: 100%;
  min-height: 300px;
}
</style>