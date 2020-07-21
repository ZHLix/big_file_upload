<template>
  <el-dropdown trigger="click"
               @command="dropdownHandle">
    <div class="el-dropdown-link text-blue"
         :style="{cursor: 'pointer'}">
      <span class="margin-left-sm">{{ username }}</span>
      <i class="el-icon-arrow-down margin-left-xs"></i>
    </div>
    <el-dropdown-menu slot="dropdown"
                      :style="{width: '120px', textAlign: 'center'}">
      <el-dropdown-item v-for="(item, key) in dropdownData"
                        :key="key"
                        :divided="item.divided"
                        :command="key">{{ item.name || item }}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
// import cForm from '@/components/Template/Form'

export default {
  data() {
    return {
      username: sessionStorage.getItem('username'),
      /**
       * 下拉菜单数据
       */
      dropdownData: {}
    }
  },

  methods: {
    init() {
      this.dropdownData = this.$api.User.dropdownData
    },
    /**
     * 下拉菜单点击事件操作
     */
    dropdownHandle(type) {
      this.dropdownData[type].click(this)
    }
  },

  created() {
    this.init()
  }
}
</script>

<style>
</style>