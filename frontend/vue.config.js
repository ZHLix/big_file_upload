module.exports = {
    // 用于嵌套生成的静态资产（js,css,img,fonts）目录
    assetsDir: 'public/static',
    filenameHashing: false,
    lintOnSave: false,
    productionSourceMap: false,
    // 是否使用包含运行时编译器的Vue核心的构建
    runtimeCompiler: false,

    configureWebpack: {
        externals: {
            // 'vue': 'Vue',
            // 'vue-router': 'VueRouter',
            // 'vuex': 'Vuex',
            // 'axios': 'axios',
            // 'element-ui': 'ElementUi',
            // 'jsencrypt': 'JSEncrypt',
            // 'js-md5': 'md5',
            // 'html2canvas': ''
        }
    },
    devServer: {
        proxy: {        //配置多个代理跨域(配置一个 proxy: 'http://localhost:4000' )
            '/': {
                target: 'http://localhost:8001',
                // target: 'http://3061w905u4.qicp.vip/',
                ws: true,  //是否跨域
                changeOrigin: true,
            }
        }
    }
}