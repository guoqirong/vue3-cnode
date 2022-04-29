/* eslint-disable @typescript-eslint/no-var-requires */
const AutoImport = require('unplugin-auto-import/webpack');
const Components = require('unplugin-vue-components/webpack');
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');
const CompressionPlugin = require('compression-webpack-plugin');

const productionGzipExtensions = ['js', 'css'];
const gzipPlugins = process.env.NODE_ENV === 'production' ? [
  // 使用Gzip压缩文件
  // 报错："TypeError: Cannot read property 'tapPromise' of undefined"是compression-webpack-plugin版本问题，建议使用5.0.1
  new CompressionPlugin({
    filename: '[path].gz[query]',
    algorithm: 'gzip',
    test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
    threshold: 10240,
    minRatio: 0.4
  })
] : [];

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      }),
      ...gzipPlugins
    ]
  }
}
