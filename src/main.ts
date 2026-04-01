import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import './styles/index.scss'

import { createPinia } from 'pinia'
import router from './router'
// 注意：在router引入之后引入
import './permission'
import { auth } from '../src/directive/index'
const app = createApp(App)

app.use(ElementPlus, {
  locale: zhCn
})
app.use(createPinia())
app.use(router)
app.directive('auth-btn', auth)
// 全局注册组件
// Removed app.component registration for 'auth' as it is a directive
app.mount('#app')
