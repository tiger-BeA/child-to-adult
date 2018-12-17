const path = require('path');
const glob = require('glob');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const vConsolePlugin = require('vconsole-webpack-plugin');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const extConfig = process.env.NODE_ENV === 'production' ? {
    inlineSource:  '.(js)$',
    minify: {
        removeComments: true,
        collapseWhitespace: true
    },
} : {};

const plugins = process.env.NODE_ENV === 'production'
? ([
    new HtmlWebpackInlineSourcePlugin(),
    // 开启scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
]) : ([
    new vConsolePlugin({
        enable: true
    }),
]);

const analyzePlugins = process.env.NODE_ENV === 'production' && process.env.npm_config_report ? [new BundleAnalyzerPlugin()] : [];

const getEntry = (globPath) => {
    let entries = {}, pathName, tmp;
    glob.sync(globPath).map((entry) => {
        tmp = path.dirname(entry).split('/').slice(-2);
        pathName = tmp.join('/'); // 正确输出js和html的路径
        entries[pathName] = Object.assign({
            entry: `src/${tmp[0]}/${tmp[1]}/main.js`,
            template: `src/${tmp[0]}/${tmp[1]}/index.html`,
            title: tmp[1],
            filename: `${tmp[1]}.html`,
        }, extConfig);
    });
    return entries;
};

const pages = getEntry('./src/pages/**?/index.html');

module.exports = {
    pages,
    productionSourceMap: false,
    baseUrl: '', // 相对于根域名的路径，
    devServer: {
        open: false,
        host: '0.0.0.0',
        port: 3000,
        https: false,
        hotOnly: false,
        disableHostCheck: true,
    },
    css: {
        extract: false,
    },
    chainWebpack: config => {
        config.plugins.delete('preload');
        config.plugins.delete('prefetch');
        config.resolve.alias
            .set('@mock', path.join(__dirname, './mock'));
    },
    configureWebpack: {
        plugins: [
            ...plugins,
            ...analyzePlugins
        ],
    },
}