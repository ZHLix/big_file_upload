<template>
  <div></div>
</template>

<script>
export default {
    data() {
        return {
            table: {
                fields: {
                    index: { type: 'index' },
                    name: { label: '课程名称' },
                    classify: { label: '课程分类' },
                    teacher_name: { label: '讲师名' },
                    price: {
                        label: '价格',
                        render: (h, text) =>
                            `<span class='text-price text-red'>${(
                                text / 100
                            ).toFixed(2)}</span>`
                    },
                    price_school: {
                        label: '价格(学校)',
                        render: (h, text) =>
                            `<span class='text-price text-red'>${(
                                text / 100
                            ).toFixed(2)}</span>`
                    },
                    count_time: {
                        label: '课程总时长',
                        minWidth: 150,
                        render: (h, text) => this.$utils.formatSeconds(text)
                    },
                    status: {
                        label: '状态',
                        render: (h, text) =>
                            `<span class="${
                                text ? 'text-green' : 'text-gray'
                            }">${text ? '启用' : '冻结'}</span>`
                    }
                    // ...this.$api.Course.tableToolbar(this)
                }
            }
        }
    }
}
</script>

<style>
</style>