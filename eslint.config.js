import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'

export default [
  // 基础配置
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
  // 插件推荐配置
  pluginJs.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  // 自定义规则（覆盖插件默认规则）
  {
    files: ['**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off', // 确保覆盖 Vue 插件的默认规则
      languageOptions: {
        globals: {
          ElMessage: 'readonly', // 声明 ElMessage 为只读全局变量
          ElMessageBox: 'readonly' // 声明 ElMessageBox 为只读全局变量
        }
      }
    },
  },
  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    languageOptions: {
      globals: {
        ...globals.node, // Node.js 全局变量声明
        module: 'writable',
        exports: 'writable',
        require: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'off' // 允许未使用的变量（JavaScript 文件规则）
    },
  },
]
