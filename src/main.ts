import { createApp } from 'vue'
// 全局引入element ui
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import store from './store'

createApp(App)
// 全局引入element ui
// .use(ElementPlus)
.use(store)
.use(router)
.mount('#app');
