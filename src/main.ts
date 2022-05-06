import './public-path';
import { App as VueApp, createApp } from 'vue';
// 全局引入element ui
// import ElementPlus from 'element-plus';
// import 'element-plus/dist/index.css';
// message样式导入 -- 几乎所有模块都会使用的，故在全局引入
import 'element-plus/theme-chalk/el-message.css';
import 'element-plus/theme-chalk/el-message-box.css';
import App from './App.vue';
import router from './router';
import store from './store';
// import useEventBus from './utils/eventBus';

// createApp(App)
// // 全局引入element ui
// // .use(ElementPlus)
// .use(store)
// .use(router)
// .mount('#app');
let instance: VueApp | undefined;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function render(props?: { [key: string]: any; } | undefined) {
  const { container, entry } = props ?? {};
  // 为了避免根id#app与其他DOM冲突，需要限制查找范围
  instance = createApp(App);
  instance.use(store).use(router).mount(container ? container.querySelector('#app') : '#app');
  // 设置父应用请求子应用路径
  store.commit('grobal/updateEntryUrl', entry);
  // 触发头部消息更新
  // const [ emitter ] = useEventBus();
  // emitter.emit('read-msg');
}

if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

//--------- 生命周期函数------------//
export async function bootstrap(): Promise<boolean> {
  console.log('[vue] vue app bootstraped')
  return await new Promise(resolve => {
    resolve(true);
  });
}

export function mount(props: {[key: string]: unknown} | undefined): void {
  console.log('[vue] props from main framework', props);
  render(props);
}

export function unmount(): void {
  if (instance) {
    console.log('[vue] vue app unmount')
    // 清除父应用请求子应用路径
    store.commit('grobal/updateEntryUrl', '');
    instance.unmount();
    instance._instance = null;
    instance = undefined;
  }
}