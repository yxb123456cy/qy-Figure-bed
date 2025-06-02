export default (command, mode) => ({
    minify: 'terser',
    terserOptions: {
      compress: {
        // 生产环境构建时移除console
        drop_console: command === 'build' && mode === 'production'
      }
    }
  });