import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './style.css'
import 'remixicon/fonts/remixicon.css'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createI18n } from 'vue-i18n';// 引入 i18n 配置

const messages = {
  en: { message: 'hello' },
  'zh-CN': { message: '你好' },
  'zh-TW': { message: '您好' },
  // 其它语言支持
};

const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: 'en', // 默认语言
  messages,
});
const app = createApp(App)
const pinia = createPinia()
app.use(router)
app.use(pinia)
app.use(ElementPlus)
// 使用 i18n 插件
app.use(i18n);
app.mount('#app')
