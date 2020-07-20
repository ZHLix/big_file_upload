<template>
  <div id="app">
    <c-layout v-if="is_login">
      <div slot="header">
        <c-user></c-user>
      </div>
      <router-view />
    </c-layout>
    <router-view v-else />
  </div>
</template>

<script>
import CLayout from '@/components/Layout'
import CUser from '@/components/User/top'
export default {
    components: { CLayout, CUser },
    data() {
        return {
            nav: [
                {
                    name: 'course-index',
                    title: '课程管理',
                    icon: 'el-icon-collection'
                },
                {
                    name: 'statistics-class/index',
                    title: '查看使用班级',
                    icon: 'el-icon-school'
                }
            ]
        }
    },
    computed: {
        is_login() {
            return this.$store.state.isLogin
        }
    },

    created() {
        this.$store.dispatch(
            'isCollapse',
            localStorage.getItem('isCollapse') == 'true'
        )

        this.$store.dispatch('nav', this.nav)
    }
}
</script>


<style lang="scss">
@import './common/colorUi/index.css';
@import './common/iconfont/iconfont.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: '微软雅黑', 'Helvetica Neue', Helvetica, 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}

/**
 * 滚动条相关
 */
::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
  scrollbar-arrow-color: red;
}
::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
  scrollbar-arrow-color: red;
}
::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
</style>