import './public-path';
import { ComponentPublicInstance, createApp } from 'vue';
// 全局引入element ui
// import ElementPlus from 'element-plus';
// import 'element-plus/dist/index.css';
// message样式导入 -- 几乎所有模块都会使用的，故在全局引入
import 'element-plus/theme-chalk/el-message.css';
import 'element-plus/theme-chalk/el-message-box.css';
import App from './App.vue';
import router from './router';
import store from './store';

// createApp(App)
// // 全局引入element ui
// // .use(ElementPlus)
// .use(store)
// .use(router)
// .mount('#app');
let instance: ComponentPublicInstance | undefined = undefined

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function render(props?: { [key: string]: any; } | undefined) {
  const { container, entry } = props ?? {};
  // 为了避免根id#app与其他DOM冲突，需要限制查找范围
  instance = await createApp(App).use(store).use(router).mount(container ? container.querySelector('#app') : '#app');
  store.commit('grobal/updateEntryUrl', entry);
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
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function unmount() {
  if (instance) {
    instance.$options.unmounted?.();
    instance.$el.innerHTML = '';
    instance = undefined;
  }
}