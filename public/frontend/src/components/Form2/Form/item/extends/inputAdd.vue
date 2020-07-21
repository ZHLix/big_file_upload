<template>
  <div class="input-add">

    <!--默认-->
    <el-input v-model="input.value"
              :type="_options.type"
              :autofocus="_options.autofocus"
              :size="_options.size"
              :readonly="_options.readonly"
              :disabled="_options.disabled"
              :clearable="_options.clearable"
              :placeholder="_options.placeholder"
              :prefixIcon="_options.prefixIcon"
              :suffixIcon="_options.suffixIcon"
              :maxlength="_options.maxlength"
              :showWordLimit="_options.showWordLimit"
              :showPassword="_options.showPassword"
              @keyup.enter.native="add">
    </el-input>

    <div class="value-container padding-lr">
      <div class="item flex flex-wrap justify-start align-center"
           v-for="(item, key) in _value"
           :key="key">
        <span>{{ item }}</span>

        <!--删除图标-->
        <span class="remove cuIcon-close text-sm text-white round margin-left"
              @click="remove(item, key)"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    /**
     * 数据值
     */
    value: String,

    /**
     * 相关配置
     */
    options: Object
  },

  data() {
    return {
      input: {
        value: ''
      }
    }
  },

  computed: {
    /**
     * 数据值
     */
    _value: {
      get() {
        let tmp = this.value || ''
        return tmp.split(',').filter(v => v)
      },
      set(val) {
        this.$emit('input', val.join(','))
      }
    },

    _options() {
      let tmp = Object.assign({}, this.options)
      return tmp
    }
  },

  methods: {
    add() {
      let tmp = this._value
      tmp.push(this.input.value)
      this._value = tmp
      this.$nextTick(() => {
        this.input.value = ''
      })
    },

    remove(val) {
      let tmp = this._value
      tmp = tmp.filter(v => v !== val)
      this._value = tmp
      this.$nextTick(() => {
        this.input.value = ''
      })
    }
  }
}
</script>

<style scoped lang="scss">
.value-container {
  .item {
    .remove {
      width: 17px;
      height: 17px;
      line-height: initial;
      transform: translateY(-1px);
      background-color: rgba(0, 0, 0, 0.3);
      cursor: pointer;
      z-index: 1;
      padding: 2px;
      display: none;
    }

    &:hover {
      .remove {
        display: inline-block;
      }
    }
  }
}
</style>