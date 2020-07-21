<script>
import CFormItem from './item'

export default {
    components: { CFormItem },
    props: {
        value: Object,
        /**
         * 表单字段
         */
        fields: Object,

        /**
         * 表单配置信息
         */
        config: Object,

        /**
         * 验证规则
         */
        validator: Object
    },

    data() {
        return {
            form: {}
        }
    },

    computed: {
        _validator() {
            const _default = {
                // (value, rows) => {}
                required: val => val !== '',
                regex: (val, rows, regex) => regex.test(val)
            }

            const rules = Object.assign({}, _default, this.validator ?? {})

            const validator = (rule, v, callback) => {
                try {
                    Object.keys(rules).forEach(k => {
                        if (rule?.[k]) {
                            if (!rules[k](v, this.form, rule[k])) {
                                throw new Error(rule.message)
                            }
                        }
                    })
                    return callback()
                } catch (e) {
                    return callback(e)
                }
            }

            return validator
        },
        /**
         * 验证规则
         */
        _rules() {
            const value = this.fields || {}
            const validator = {}
            Object.keys(value).forEach(k => {
                let tmp = []
                if (value[k]?.rules) {
                    tmp = value[k].rules.map(v => {
                        return {
                            trigger: 'blur',
                            ...v,
                            validator: this._validator
                        }
                    })
                }
                validator[k] = tmp
            })
            return validator
        }
    },

    render(h) {
        const item = obj => {
            return Object.keys(obj).map(k =>
                h('c-form-item', {
                    props: {
                        value: this.form[k] ?? '',
                        prop: k,
                        config: obj[k],
                        global: this.config
                    },
                    on: {
                        input: v => {
                            this.form = Object.assign({}, this.form, { [k]: v })
                        },
                        submit: async () => {
                            this.submit()
                        }
                    }
                })
            )
        }

        return h(
            'el-form',
            {
                ref: 'form',
                props: Object.assign(
                    { labelPosition: 'left' },
                    { model: this.form, rules: this._rules },
                    this.config
                ),
                nativeOn: {
                    submit: e => {
                        // console.log(e)
                        // 阻止 事件冒泡
                        e.stopPropagation()
                        // 阻止该元素默认的 keyup 事件
                        e.preventDefault()
                    }
                }
            },
            item(this.fields)
        )
    },

    methods: {
        /**
         * 验证
         */
        validate() {
            return new Promise(resolve => {
                this.$refs.form.validate(
                    valid => valid && resolve(Object.assign({}, this.form))
                )
            })
        },
        reset() {
            this.$refs.form.resetFields()
            this.$emit('reset')
        },
        submit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.$emit('submit', this.form)
                }
            })
        }
    },

    mounted() {
        const res = {}
        Object.keys(this.fields).forEach(k => {
            res[k] = this.value?.[k] ?? this.fields[k]?.value ?? ''
        })
        this.form = Object.assign({}, res)
    }
}
</script>