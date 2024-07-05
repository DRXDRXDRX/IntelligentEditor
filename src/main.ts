import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vueNativeWebSocket from 'vue-native-websocket-vue3';

import './style.css'
import 'remixicon/fonts/remixicon.css'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
// 导入 ant-design-vue 组件库
import Antd from 'ant-design-vue';


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
app.use(Antd);
app.use(ElementPlus)
// 使用 i18n 插件
app.use(i18n);
app.use(vueNativeWebSocket, 'https://firlin.cn/api/v1/docws', {
  format: 'json',
  reconnection: true, // 自动重连
  reconnectionAttempts: 5, // 重连次数
  reconnectionDelay: 3000 // 重连间隔时间
})
app.mount('#app')
