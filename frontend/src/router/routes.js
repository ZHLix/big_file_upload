const files = require.context('@/pages', true, /\.vue$/)
const importRouter = require('./import_router')

export default files.keys().map(v => {
    let key = v.match(/\.\/(.*)\.vue/)[1]
    return {
        name: key.replace('/', '-'),
        path: `/${key == 'index' ? '' : key}`,
        component: importRouter(key)
    }
})