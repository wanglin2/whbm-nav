const path = require('path');

module.exports = {
    publicPath: './',
    lintOnSave: false,
    productionSourceMap: false,
    configureWebpack: {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src/'),
                '@c': path.resolve(__dirname, './src/components/'),
            },
        },
        devServer: {
            historyApiFallback: true
        },
    }
}