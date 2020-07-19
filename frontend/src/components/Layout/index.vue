<!--
 * @Date: 2020-04-07 13:53:27
 * @LastEditors: zhlix <15127441165@163.com>
 * @LastEditTime: 2020-04-14 18:19:30
 * @FilePath: \frozen_food_mall\src\components\Layout\index.vue
 -->
<template>
  <div class="layout-container flex flex-direction">
    <el-container class="flex-sub flex flex-wrap">

      <!--left start-->
      <el-menu class="menu left el-menu-vertical"
               :collapse="!isCollapse"
               :default-active="defaultActive"
               unique-opened>

        <!--logo start-->
        <div class="logo padding-top-lg padding-bottom-lg margin-lr-sm text-center solid-bottom cursor"
             @click="logoHandle">
          <el-avatar src="/public/static/logo.jpg"></el-avatar>
        </div>
        <!--logo end-->

        <!--menu item start-->
        <template v-for="(item, key) in nav">

          <el-submenu :index="item.name"
                      :key="key"
                      v-if="item.children && item.children.length">
            <template slot="title">
              <i :class="item.icon"
                 v-if="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>

            <template v-for="(item2, key2) in item.children">

              <el-menu-item :index="item2.name"
                            :key="key2"
                            @click="navHandle(item2, [item, item2])">
                <i :class="item2.icon"
                   v-if="item2.icon"></i>
                <span slot="title">{{ item2.title }}</span>
              </el-menu-item>

            </template>

          </el-submenu>

          <el-menu-item :index="item.name"
                        :key="key"
                        v-else
                        @click="navHandle(item, [item])">
            <i :class="item.icon"
               v-if="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
        <!--menu item end-->
      </el-menu>
      <!--left end-->

      <!--right start-->
      <el-container class="right flex-sub"
                    :style="{minWidth: '400px'}">

        <!--header start-->
        <el-header class="margin-top padding-lr header">
          <div class="cu-bar padding-lr-lg bg-white radius"
               style="min-height: 60px;">
            <div class="left flex flex-wrap align-center">
              <el-checkbox v-model="isCollapse">{{ isCollapse ? '展开' : '收起'}}</el-checkbox>
            </div>
            <div class="right flex flex-wrap align-center">
              <slot name="header"></slot>
              <!-- <button class="cu-btn bg-white cuIcon-refresh text-lg"
                      title="刷新页面"
                      @click="refreshHandle"></button> -->
              <!-- <c-user></c-user> -->
            </div>
          </div>
        </el-header>
        <!--header end-->

        <!--main start-->
        <el-main class="main padding flex flex-direction">
          <slot v-if="refresh"></slot>
        </el-main>
        <!--main end-->

      </el-container>
      <!--right end-->

    </el-container>

  </div>
</template>

<script>
// import cUser from './user'

export default {
    name: 'index',
    /**
     * 计算
     */
    computed: {
        /**
         * 是否水平折叠收起菜单
         */
        isCollapse: {
            get() {
                return !this.$store.state.isCollapse
            },
            set(v) {
                this.$store.dispatch('isCollapse', !v)
            }
        },

        /**
         * 当前激活菜单的 index
         */
        defaultActive() {
            return this.$route.name
        },

        /**
         * 导航列表
         */
        nav() {
            return this.$store.state.nav
        }
    },

    /**
     * 数据
     */
    data() {
        return {
            /**
             * 刷新页面
             */
            refresh: true
        }
    },

    /**
     * 方法
     */
    methods: {
        /**
         * 导航列表点击回调
         */
        navHandle(obj) {
            if (obj.name !== this.$route.name) {
                this.$router.push(obj)
                // this.refreshHandle()
            }
        },

        /**
         * logo 点击回调
         */
        logoHandle() {
            if (this.$route.path !== '/') {
                this.$router.push({ path: '/' })
                // this.refreshHandle()
            }
        },

        reload() {
            this.$router.back()
        }
    }
}
</script>

<style>
.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
  height: 100vh;
  overflow-y: auto;
}
</style>

<style scoped
       lang="scss">
.layout-container {
  width: 100vw;
  min-width: 700px;
  height: 100vh;
  .right {
    position: relative;

    .header {
      width: 100%;
      z-index: 10;
      position: absolute;
      top: 0;
      right: 0;
    }

    .main {
      padding-top: 90px !important;
    }
  }

  .menu {
    z-index: 20;
    overflow: hidden;
  }
}
</style>