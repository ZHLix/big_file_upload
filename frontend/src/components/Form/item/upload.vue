<script>
export default {
    props: {
        value: String,
        config: Object
    },

    computed: {
        _value() {
            let tmp = this.value
            if (typeof tmp === 'string') {
                tmp = tmp.split(',').filter(v => v)
            }
            // console.log(tmp, this.cache)
            const res = tmp.map(v => {
                // const old = this.cache.find(
                //     v2 => (v2.url ?? v2.response.url) == v
                // )
                // const old = this.cache?.[k]
                // if (old && (old.url ?? old.response.url) == v) return old
                // console.log(v)
                return {
                    name: v.match(/\/([^/]*)$/)[1],
                    url: v
                }
            })
            return res
            // },
            // set(v) {
            //     function isEdit(data, row) {
            //         let data_re = {}
            //         Object.keys(data).forEach(k => {
            //             data_re[k] = row[k]
            //         })
            //         return JSON.stringify(data) !== JSON.stringify(data_re)
            //     }
            //     if (isEdit(v, this.cache)) {
            //         this.cache = v
            //         console.log('isEdit')
            //         this.$emit(
            //             'input',
            //             v.map(v => v.url ?? v.response.url).join(',')
            //         )
            //     }
            // }
        },

        /**
         * 开启分片上传
         */
        shard() {
            return this.config.shard ?? false
        },

        fileSize() {
            return this.config.fileSize ?? 2
        }
    },

    data() {
        return {
            cache: [],
            fileList: [],
            init: false,
            cancels: {}
        }
    },

    watch: {
        value() {
            // console.log('this init', this.init)
            if (!this.init) {
                // console.log(this._value)
                this.fileList = this._value

                this.init = true
            }
        }
    },

    methods: {
        /**
         * 上传前回调
         */
        beforeUpload(file) {
            try {
                let accept = this.config.accept ?? ''
                const types = accept.split(',').filter(v => v)
                const fileType = file.type

                if (types.findIndex(v => v === fileType) === -1) {
                    throw new Error(`只允许上传${accept}类型文件!`)
                }

                if (file.size / 1024 / 1024 > this.fileSize) {
                    throw new Error(`上传视频大小不能超过${this.fileSize}MB!`)
                }

                return true
            } catch (e) {
                this.$message.warning(e.message)
                this.$refs.upload.uploadFiles = []
                return false
            }
        },

        /**
         * 自定义上传行为
         * {action, data, file,filename, headers, onError, onProgress, onSuccess}
         */
        async httpRequest({
            action,
            data,
            file,
            filename,
            headers,
            onProgress,
            onSuccess
        }) {
            const CancelToken = this.$api.$request.$axios.CancelToken
            let cancels = []
            let start = 0 // 上传位置
            // 获取文件是否上传
            const {
                data: { path, status }
            } = await this.$api.$request.get(action, {
                filename: file.name
            })
            if (path) {
                onSuccess(this.trim(path))
                return this.trim(path)
            } else {
                start = status
            }

            const chunks = this.slice(file)
            const rate_avg = 100 / chunks.length
            let rate_cur = 0
            const tasks = []
            chunks.forEach(async (v, k) => {
                if (k < start) return
                let rate = (k / chunks.length) * 100
                const config = {
                    cancelToken: new CancelToken(c => cancels.push(c)),
                    onUploadProgress: e => {
                        //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
                        //如果lengthComputable为false，就获取不到e.total和e.loaded
                        if (e.lengthComputable) {
                            const rate_cur_tmp =
                                rate + (e.loaded / e.total) * rate_avg //已上传的比例
                            if (rate_cur_tmp > rate_cur) {
                                rate_cur = rate_cur_tmp
                                if (rate_cur < 100) {
                                    //这里的进度只能表明文件已经上传到后台，但是后台有没有处理完还不知道
                                    //因此不能直接显示为100%，不然用户会误以为已经上传完毕，关掉浏览器的话就可能导致上传失败
                                    //等响应回来时，再将进度设为100%
                                    e.percent = rate_cur
                                    onProgress(e)
                                }
                            }
                        }
                    }
                }
                const formData = new FormData()
                formData.append('filename', file.name)
                formData.append('chunk', k + 1)
                formData.append('chunks', chunks.length)
                formData.append(filename, v)
                if (data) {
                    Object.keys(data).forEach(k2 => {
                        formData.append(k2, data[k2])
                    })
                }
                tasks.push(
                    this.$api.$request.post(action, formData, headers, config)
                )
            })
            this.cancels[file.name] = cancels

            const res = await this.$api.$request.$axios
                .all(tasks)
                .then(res => {
                    res = res[res.length - 1]
                    delete this.cancels[file.name]
                    file.percent = 100
                    onProgress(file)
                    return this.trim(res.data.path)
                })
                .catch(err => {
                    delete this.cancels[file.name]
                    cancels.forEach(c => c(err.message))
                    this.$message.error(err.message)
                })
            onSuccess(res)
            return res
        },

        slice(file, piece = 1024 * 1024 * 5) {
            let totalSize = file.size // 文件总大小
            let start = 0 // 每次上传的开始字节
            let end = start + piece // 每次上传的结尾字节
            let chunks = []
            while (start < totalSize) {
                // 根据长度截取每次需要上传的数据
                // File对象继承自Blob对象，因此包含slice方法
                let blob = file.slice(start, end)
                chunks.push(blob)

                start = end
                end = start + piece
            }
            return chunks
        },

        onPreview(row) {
            // console.log(row)
        },
        onSuccess(row, file) {
            // console.log('onSuccess', row, this._value)
            // this.addFile(row.url)
            // this._value = [...this._value, file]
            // console.log('file response', file.response)
            // console.log(file, this.$refs.upload.fileList, this.$refs.upload.uploadFiles)
            // this.$nextTick(() => {
            // console.log(
            //     this.$refs.upload.fileList,
            //     this.$refs.upload.uploadFiles
            // )
            // this._value = this.$refs.upload.uploadFiles
            // })
            // const update_length =
            //     this.$refs.upload.uploadFiles.length - this._value.length
            // console.log('update_length', update_length)
            // if (this.fileList !== update_length - 1) {
            //     this.fileList = [...this.fileList, file]
            // } else {
            //     this._value = this.$refs.upload.uploadFiles
            // }
            // if (
            //     file.uid ===
            //     this.$refs.upload.uploadFiles[
            //         this.$refs.upload.uploadFiles.length - 1
            //     ].uid
            // ) {
            //     console.log('last end')
            //     this._value = this.$refs.upload.uploadFiles
            // }
            this.input()
        },
        onRemove(file) {
            // console.log(this.$refs.upload)
            file && this.cancels[file.name]?.forEach(c => c('终止上传'))
            // this.delFile(file.url ?? file.response)
            // this.delFile(file)
            // this._value = this.$refs.upload.uploadFiles
            this.input()
        },
        // beforeRemove(file, fileList) {
        //     console.log('beforeRemove', file, fileList)
        //     file && this.cancels[file.name]?.forEach(c => c('终止上传', 200))
        //     return Promise.reject(file)
        // },

        input() {
            const val = this.$refs.upload.uploadFiles
                .map(v => v.url ?? v.response?.url ?? null)
                .filter(v => v)
            // console.log(this.$refs.upload.uploadFiles, val)
            this.$emit('input', val.join(','))
        },

        // addFile(url) {
        // this._value = this._value.concat({
        //     name: url.match(/\/([^/]*)$/)[1],
        //     url
        // })
        //     this._value.push({
        //         name: url.match(/\/([^/]*)$/)[1],
        //         url
        //     })
        // },

        trim(url) {
            return {
                name: url.match(/\/([^/]*)$/)[1],
                url
            }
        }

        // delFile(url) {
        //     this._value = this._value.filter(v => v.uid !== url.uid)
        // }
    },

    async mounted() {
        await this.$utils.setTimeout(100)
        this.init = true
        // this.fileList = this._value
    },

    render(h) {
        const tip = str =>
            h('div', { slot: 'tip', class: 'el-upload__tip' }, str)
        const drag = () => [
            h('i', { class: 'el-icon-upload' }),
            h('div', { class: 'el-upload__text' }, [
                '将文件拖到此处，或',
                h('em', '点击上传')
            ])
        ]
        const upload = () =>
            h(
                'el-button',
                {
                    props: { type: 'success' },
                    on: {
                        click: e => {
                            this.$refs.upload.submit()
                            // 阻止 事件冒泡
                            e.stopPropagation()
                            // 阻止该元素默认的 keyup 事件
                            e.preventDefault()
                        }
                    }
                },
                '上传到服务器'
            )

        return h(
            'el-upload',
            {
                ref: 'upload',
                props: Object.assign(
                    {
                        action: '',
                        withCredentials: true,
                        name: 'file',
                        // fileList: this.fileList,
                        onPreview: this.onPreview,
                        onSuccess: this.onSuccess,
                        onRemove: this.shard ? this.onRemove : undefined,
                        // beforeRemove: this.beforeRemove,
                        beforeUpload: this.beforeUpload, // 上传前回调
                        httpRequest: this.shard ? this.httpRequest : undefined, // 自定义上传
                        headers: this.config.headers ?? {}
                    },
                    { fileList: this.fileList },
                    this.config
                )
                // on: {
                //     input: v => {
                //         if (this.config.readonly) return false
                //         console.log(v)
                //         this.$emit('input', v)
                //     }
                // }
            },
            [
                this.config.drag === true
                    ? drag()
                    : h('el-button', {}, '选择文件'),
                this.config.autoUpload === false ? upload() : null,
                this.config.tip ? tip(this.config.tip) : null
            ]
        )
    }
}
</script>