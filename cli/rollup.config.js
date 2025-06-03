import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'

export default {
  input: './src/index.js',
  output: {
    file: './dist/qy-image-cli.js',
    format: 'cjs',
    banner: '#!/usr/bin/env node'
  },
  plugins: [
    nodeResolve({ preferBuiltins: false }), // 禁用优先使用内置模块
    commonjs(),
    json() // 处理 JSON 文件
  ]
}
