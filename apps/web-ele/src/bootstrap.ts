import { createApp } from 'vue';

import { registerAccessDirective } from '@vben/access';
import { initStores } from '@vben/stores';
import '@vben/styles';
import '@vben/styles/ele';

import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import ElementPlus from 'element-plus';
// @ts-ignore 没有类型声明
import mixboard from 'mixboard';
// @ts-ignore 没有类型声明
import mixlinker2d from 'mixlinker2d';

import { setupI18n } from '#/locales';

import App from './app.vue';
import { router } from './router';

import 'mixboard/style';
// import 'mixlinker2d/style';

import 'element-plus/dist/index.css';

async function bootstrap(namespace: string) {
  const app = createApp(App);
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }
  // 国际化 i18n 配置
  await setupI18n(app);
  // 配置 pinia-tore
  await initStores(app, { namespace });
  // 安装权限指令
  registerAccessDirective(app);
  // 配置路由及路由守卫
  app.use(router);
  app.use(ElementPlus);
  app.use(mixlinker2d);
  app.use(mixboard);
  app.mount('#app');
}

export { bootstrap };
