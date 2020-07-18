export default class Base {
  constructor(root) {
    this.$root = root
    this.$vm = root.$vm
  }

  bind(vm) {
    this.$vm = vm
  }

  /**
   * 模拟数据返回
   */
  result(data, code = 200, msg = '') {
    return new Promise(resolve => resolve({
      code: code ?? 200,
      data: data ?? null,
      msg: msg ?? '',
      success: Boolean(code === 200)
    }))
  }

  tableToolbar(actions = null, options = {}) {
    const toolbar = {
      label: '操作',
      width: 140,
      align: 'center',
      fixed: 'right',
    }
    if (!actions) {
      actions = {
        create: {title: '添加', icon: 'el-icon-plus', header: true},
        edit: {title: '修改', icon: 'el-icon-edit', type: 'primary',},
        del: {title: '删除', icon: 'el-icon-delete', type: 'danger',}
      }
    }

    if (typeof actions == 'object') {

      const _header = {}
      const _actions = {}
      Object.keys(actions).forEach(k => {
        const tmp = actions[k]
        if (tmp.header) {
          _header[k] = tmp
        } else {
          _actions[k] = tmp
        }
      })
      

      if (Object.keys(_header).length) {
        toolbar.header = (h) => {
          return Object.keys(_header).map(k => {
            return h('el-button', {props: _header[k], on: {click: () => _header[k].click()}}, _header[k].title)
          }).filter(v => v)
        }
      }

      if (Object.keys(_actions).length) {
        toolbar.actions = (h, {row}) => {
          return Object.keys(_actions).map(k => {
            return h('el-button', {props: _actions[k], on: {click: () => _actions[k].click(row)}}, _actions[k].title)
          }).filter(v => v)
        }
      }

    } else if (typeof actions == 'function') {
      toolbar.render = actions
    }
    return {
      toolbar: Object.assign({}, toolbar, options)
    }
  }


  isEdit(data, row) {
    let data_re = {}
    Object.keys(data).forEach(k => {
      data_re[k] = row[k]
    })
    return JSON.stringify(data) !== JSON.stringify(data_re)
  }


  /**
   * list 请求参数调整
   * @param {*} param0
   */
  params({page = 1, limit = null, search = {}, ...other}) {
    let req = {}

    /**
     * 分页
     */
    if (limit && page) {
      req.offset = (page - 1) * limit
      req.limit = limit
    }

    /**
     * 搜索
     */
    Object.keys(search).forEach(k => {
      let tmp = search[k]
      if (tmp == null || tmp == undefined || tmp == '') return false
      req[k] = tmp
    })

    return Object.assign({}, req, other)
  }
}