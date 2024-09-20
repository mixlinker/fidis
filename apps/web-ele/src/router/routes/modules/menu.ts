import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'lucide:menu',
      order: 2,
      title: $t('page.menuManage.title'),
    },
    name: 'menuManage',
    path: '/menu',
    children: [
      {
        name: 'menuList',
        path: '/menulist',
        component: () => import('#/views/menu/menu/index.vue'),
        meta: {
          affixTab: false,
          icon: 'lucide:align-start-vertical',
          title: $t('page.menu.title'),
        },
      },
      {
        name: 'MenuMenuDetail',
        path: '/menuMenuDetail/:id',
        component: () => import('#/views/menu/menu/detail.vue'),
        meta: {
          affixTab: false,
          hideInMenu: true,
          title: $t('page.menu.detail-title'),
        },
      },
    ],
  },
];

export default routes;
