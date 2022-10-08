module.exports = {
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      // 别名
      alias: {

        // @代表src;
        'assets': '@/assets',
        'common': '@/components/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views',
        'content': '@/components/content',

      }
    }
  }
}
