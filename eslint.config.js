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
    },
  },
  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    languageOptions: {
      globals: {
        module: 'writable',
        exports: 'writable',
        require: 'readonly',
      },
    },
  },
]