<script>
export default {
    props: {
        value: String,
        config: Object
    },

    computed: {
        _value() {
            // let tmp = this.value
            return []
        }
    },

    render(h) {
        console.log(
            Object.assign({ action: '' }, { value: this._value }, this.config)
        )

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
                        beforeUpload: this.beforeUpload,
                        httpRequest: this.httpRequest,
                        headers: this.config.headers ?? {}
                    },
                    { fileList: this._value },
                    this.config
                ),
                on: {
                    input: v => {
                        if (this.config.readonly) return false
                        this.$emit('input', v)
                    }
                }
            },
            [
                this.config.drag === true
                    ? drag()
                    : h('el-button', {}, '选择文件'),
                this.config.autoUpload === false ? upload() : null,
                this.config.tip ? tip(this.config.tip) : null
            ]
        )
    },

    // data() {
    //     return {
    //         /**
    //          * 任务列表
    //          */
    //         list: [],
    //         /**
    //          * 请求状态
    //          */
    //         requestStatus: false
    //     }
    // },

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

                if (file.size / 1024 / 1024 > this.config.fileSize) {
                    throw new Error(
                        `上传视频大小不能超过${this.config.fileSize}MB!`
                    )
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
        httpRequest({
            action,
            data,
            file,
            filename,
            headers,
            onError,
            onProgress,
            onSuccess
        }) {
            const chunks = this.slice(file)
            const rate_avg = 100 / chunks.length
            // let finished = 1
            // const total = chunks.length
            const tasks = []
            chunks.forEach(async (v, k) => {
                let rate = (k / chunks.length) * 100
                // console.log(rate_avg, rate)
                const config = {
                    onUploadProgress: e => {
                        //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
                        //如果lengthComputable为false，就获取不到e.total和e.loaded
                        if (e.lengthComputable) {
                            // console.log(e.loaded, e.total)
                            const rate_cur =
                                rate + (e.loaded / e.total) * rate_avg //已上传的比例
                            if (rate_cur < 100) {
                                //这里的进度只能表明文件已经上传到后台，但是后台有没有处理完还不知道
                                //因此不能直接显示为100%，不然用户会误以为已经上传完毕，关掉浏览器的话就可能导致上传失败
                                //等响应回来时，再将进度设为100%
                                // console.log(rate)
                                console.log(rate_cur)
                                file.percent = rate_cur
                                onProgress(file)
                            }
                        }
                    }
                }

                const formData = new FormData()
                formData.append('filename', file.name)
                formData.append('chunk', k + 1)
                formData.append(filename, v)
                if (data) {
                    Object.keys(data).forEach(k2 => {
                        formData.append(k2, data[k2])
                    })
                }
                tasks.push(
                    this.$api.$request.post(action, formData, headers, config)
                )
                // const result = await this.$api.$request.post(
                //     action,
                //     formData,
                //     headers,
                //     config
                // )

                // if (result.code !== 200) {
                //     onError(result.message)
                // }

                // finished += 1
                // if (finished == total) {
                //     file.percent = 100
                //     onProgress(file)

                //     await this.$utils.setTimeout(300)
                //     onSuccess(file)
                // }
            })

            Promise.all(tasks).then(async res => {
                console.log(res)
                file.percent = 100
                onProgress(file)
                this.$api.$request.put(action, {
                    filename: file.name
                })
                await this.$utils.setTimeout(300)
                onSuccess(file)
            })
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
        }
    }
}
</script>

<style>
</style>