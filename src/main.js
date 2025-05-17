import {createApp} from 'vue'
import App from './App.vue'
import router from './router/router.js'
import ElementPlus, {ElMessage} from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router)
app.use(ElementPlus)

// 统一设置 ElMessage 的偏移量
const messageTypes = ['success', 'warning', 'info', 'error']
messageTypes.forEach(type => {
    const original = ElMessage[type]
    ElMessage[type] = (options) => {
        if (typeof options === 'string') {
            options = {message: options}
        }
        options.offset = 70
        return original(options)
    }
})

app.mount('#app')

export default app