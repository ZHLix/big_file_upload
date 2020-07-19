<template>
  <div class="course-index-container">
    <c-table-form ref="tableForm"
                  api-name="Course"></c-table-form>
    <el-dialog :visible.sync="exam.visible"
               :close-on-click-modal="false">
      <c-exam v-if="exam.visible"
              v-model="exam.data"
              api-name="Course"
              :course="exam.row"></c-exam>
    </el-dialog>
    <el-dialog :visible.sync="courseClass.visible"
               :close-on-click-modal="false">
      <c-course-class v-if="courseClass.visible"
                      v-model="courseClass.id"
                      :course="courseClass.row"></c-course-class>
    </el-dialog>
  </div>
</template>

<script>
import CTableForm from '@/components/Template/TableForm'
import CExam from './exam'
import CCourseClass from './class'
export default {
    components: { CTableForm, CExam, CCourseClass },

    data() {
        return {
            exam: {
                visible: false,
                row: {},
                data: ''
            },
            courseClass: {
                visible: false,
                id: null,
                row: {}
            }
        }
    },

    methods: {
        examShow(row) {
            this.exam.visible = true
            this.exam.row = row
            this.exam.data = row.exam
        },
        classShow(row) {
            this.courseClass.visible = true
            this.courseClass.id = row.id
            this.courseClass.row = row
        }
    }
}
</script>

<style lang="scss" scoped>
.course-index-container {
  width: 100%;
  height: 100%;
}
</style>