<template>
  <div class="course-class-container">
    <!-- <div class="cu-bar">
      <el-button size="mini"
                 type="primary"
                 :loading="sync"
                 @click="syncHandle">一键同步</el-button>
    </div> -->
    <c-table-form ref="tableForm"
                  api-name="CourseClass"
                  height="600px"></c-table-form>
    <el-dialog :visible.sync="exam.visible"
               append-to-body
               :close-on-click-modal="false">
      <c-exam v-if="exam.visible"
              v-model="exam.data"
              api-name="CourseClass"
              :course="exam.row"></c-exam>
    </el-dialog>
  </div>
</template>

<script>
import CTableForm from '@/components/Template/TableForm'
import CExam from './exam'
export default {
    components: { CTableForm, CExam },
    props: {
        value: Number,

        course: Object
    },

    data() {
        return {
            exam: {
                visible: false,
                row: {},
                data: ''
            },

            sync: false
        }
    },

    methods: {
        examShow(row) {
            this.exam.visible = true
            this.exam.row = row
            this.exam.data = row.exam
        },

        async syncHandle() {
            this.$confirm(
                '同步后，所有考题数据将重置，是否确认同步？',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }
            )
                .then(async () => {
                    this.sync = true
                    let { success, msg } = await this.$api.CourseClass.sync(
                        this.course
                    )
                    this.sync = false
                    this.$message[success ? 'success' : 'warning'](msg)
                    if (!success) return false
                    await this.$utils.setTimeout(600)
                    this.$refs.tableForm.select()
                    this.$parent.$parent.$refs.tableForm.select()
                })
                .catch(() => {
                    this.$message.info('已取消同步')
                })
        }
    }
}
</script>

<style>
</style>