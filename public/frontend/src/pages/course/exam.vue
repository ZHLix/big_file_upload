<template>
  <div class="course-exam-container">
    <c-table-form api-name="CourseExam"
                  height="600px"></c-table-form>
  </div>
</template>

<script>
import CTableForm from '@/components/Template/TableForm'
export default {
    components: { CTableForm },
    props: {
        value: String,

        course: Object,

        apiName: String
    },

    mounted() {},

    destroyed() {
        this.$parent.$parent.$refs.tableForm.select()
    }
}
</script>

<style lang="scss" scoped>
.course-exam-container {
  width: 100%;
  height: 100%;
}
</style>