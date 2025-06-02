import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router.js'
import ElementPlus, { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/css/reset.css'
import './assets/css/element-plus.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import components from './components'

function createVueApp() {
  const app = createApp(App)

  // 注册系统级组件
  registerIcons(app)
  
  // 安装插件
  installPlugins(app)

  // 应用全局配置
  configureGlobalSettings()

  return app
}

function registerIcons(app) {
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
}

function installPlugins(app) {
  app
    .use(router)
    .use(components)
    .use(ElementPlus)
}

function configureGlobalSettings() {
  const messageTypes = ['success', 'warning', 'info', 'error']
  messageTypes.forEach((type) => {
    const original = ElMessage[type]
    ElMessage[type] = (options) => {
      if (typeof options === 'string') {
        options = { message: options }
      }
      options.offset = 70
      return original(options)
    }
  })
}

const app = createVueApp().mount('#app')

export default app
