<script>
export default {
    props: {
        value: String | Number,
        config: Object
    },

    computed: {
        _value() {
            let tmp = this.value
            if (typeof tmp == 'string') {
                tmp = Number(tmp)
            }
            return tmp
        },
        _config() {
            return Object.assign({ total: 0, pageSize: 100 }, this.config)
        }
    },

    render(h) {
        return h('el-pagination', {
            props: Object.assign({ currentPage: this._value }, this._config),
            on: {
                'current-change': page => {
                    this.$emit('pagination', {
                        page,
                        limit: this._config.pageSize
                    })
                },
                'size-change': limit => {
                    this.$emit('pagination', { page: this._value, limit })
                }
            }
        })
    }
}
</script>