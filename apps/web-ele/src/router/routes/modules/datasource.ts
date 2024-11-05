import type { RouteRecordRaw } from 'vue-router';

import { defineAsyncComponent } from 'vue';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'lucide:database',
      order: 3,
      title: $t('page.data-source.title'),
    },
    name: 'dataSource',
    path: '/datasource',
    children: [
      {
        name: 'InSource',
        path: '/inSource',
        component: defineAsyncComponent(
          () => import('#/views/datasource/in/index.vue'),
        ),
        meta: {
          affixTab: false,
          icon: 'lucide:database-zap',
          title: $t('page.in-source.title'),
        },
      },
      {
        name: 'InSourceDetail',
        path: '/inSourceDetail/:id',
        component: defineAsyncComponent(
          () => import('#/views/datasource/in/detail.vue'),
        ),
        meta: {
          affixTab: false,
          hideInMenu: true,
          title: $t('page.in-source.detail-title'),
        },
      },
    ],
  },
];

export default routes;
