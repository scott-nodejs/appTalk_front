const path = require('path')
module.exports = {
    base: {
        path: path.resolve(__dirname, '../public/client'),
        publicPath: 'http://cdn.app.shuo.club/',
        assetsPath: ''
    },
    dev: {
        env: 'development',
        publicPath: '/',
        assetsPath: 'static',
        assetsSubDirectory: 'static',
        devtoolType: 'cheap-module-eval-source-map',
    },
    build: {
        env: 'production',
        publicPath: 'http://cdn.app.shuo.club/',
        assetsPath: '',
        assetsSubDirectory: '',
        devtoolType: 'source-map'
    }
}