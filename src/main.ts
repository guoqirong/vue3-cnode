import { createApp } from 'vue';
// 全局引入element ui
// import ElementPlus from 'element-plus';
// import 'element-plus/dist/index.css';
// message样式导入 -- 几乎所有模块都会使用的，故在全局引入
import 'element-plus/es/components/message/style/css'
import App from './App.vue';
import router from './router';
import store from './store';

createApp(App)
// 全局引入element ui
// .use(ElementPlus)
.use(store)
.use(router)
.mount('#app');
