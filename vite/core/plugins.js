import vue from '@vitejs/plugin-vue';
import viteCompression from 'vite-plugin-compression';
import { createHtmlPlugin } from 'vite-plugin-html';

export default (env) => [
  vue(),
  // 大于10KB的文件进行gzip压缩
  viteCompression({ threshold: 10240 }),
  // HTML模板注入
  createHtmlPlugin({
    inject: { data: { title: env.VITE_APP_TITLE } }
  })
];