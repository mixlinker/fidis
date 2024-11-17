import type { RouteRecordRaw } from 'vue-router';

import { defineAsyncComponent } from 'vue';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

export const terminal: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'lucide:radio-tower',
      order: 3,
      title: $t('terminal.title'),
    },
    name: 'terminal',
    path: '/terminal',
    children: [
      {
        name: 'terminalManager',
        path: '/terminalManager',
        component: defineAsyncComponent(
          () => import('#/views/terminal/manager/index.vue'),
        ),
        meta: {
          affixTab: false,
          icon: 'lucide:layout-list',
          title: $t('terminal.terminal.title'),
        },
      },
      {
        name: 'terminalDetail',
        path: '/terminalDetail/:id',
        component: defineAsyncComponent(
          () => import('#/views/terminal/manager/detail.vue'),
        ),
        meta: {
          affixTab: false,
          hideInMenu: true,
          title: $t('terminal.terminal.detail'),
        },
      },
      {
        name: 'terminalConfig',
        path: '/terminalConfig',
        component: defineAsyncComponent(
          () => import('#/views/terminal/config/index.vue'),
        ),
        meta: {
          affixTab: false,
          icon: 'lucide:file-sliders',
          title: $t('terminal.config.title'),
        },
      },
      {
        name: 'terminalConfigDetail',
        path: '/terminalConfigDetail/:id',
        component: defineAsyncComponent(
          () => import('#/views/terminal/config/detail.vue'),
        ),
        meta: {
          affixTab: false,
          hideInMenu: true,
          title: $t('terminal.config.detail'),
        },
      },
    ],
  },
];
