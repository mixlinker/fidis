import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'lucide:layout-dashboard',
      order: -1,
      title: $t('page.usercenter.title'),
    },
    name: 'UserCenter',
    path: '/',
    children: [
      {
        name: 'Company',
        path: '/company',
        component: () => import('#/views/usercenter/company/index.vue'),
        meta: {
          affixTab: true,
          icon: 'lucide:area-chart',
          title: $t('page.company.title'),
        },
      },
      {
        name: 'CompanyDetail',
        path: '/companyDetail/:id',
        component: () => import('#/views/usercenter/company/detail.vue'),
        meta: {
          affixTab: false,
          hideInMenu: true,
          title: $t('page.company.detail-title'),
        },
      },
      {
        name: 'Role',
        path: '/role',
        component: () => import('#/views/usercenter/role/index.vue'),
        meta: {
          affixTab: false,
          icon: 'lucide:square-user-round',
          title: $t('page.role.title'),
        },
      },
      {
        name: 'RoleDetail',
        path: '/roleDetail/:id',
        component: () => import('#/views/usercenter/role/detail.vue'),
        meta: {
          affixTab: false,
          hideInMenu: true,
          title: $t('page.role.detail-title'),
        },
      },
      {
        name: 'User',
        path: '/user',
        component: () => import('#/views/usercenter/user/index.vue'),
        meta: {
          affixTab: false,
          icon: 'lucide:user',
          title: $t('page.user.title'),
        },
      },
      {
        name: 'UserDetail',
        path: '/userDetail/:id',
        component: () => import('#/views/usercenter/user/detail.vue'),
        meta: {
          affixTab: false,
          hideInMenu: true,
          title: $t('page.user.detail-title'),
        },
      },
    ],
  },
];

export default routes;
