import type {
  ComponentRecordType,
  GenerateMenuAndRoutesOptions,
} from '@vben/types';

import { generateAccessible } from '@vben/access';
import { preferences } from '@vben/preferences';

import { ElMessage } from 'element-plus';

import { getUserMenuApi } from '#/api';
import { BasicLayout, IFrameView } from '#/layouts';
import { $t } from '#/locales';

const forbiddenComponent = () => import('#/views/_core/fallback/forbidden.vue');

async function generateAccess(options: GenerateMenuAndRoutesOptions) {
  const pageMap: ComponentRecordType = import.meta.glob('../views/**/*.vue');

  const layoutMap: ComponentRecordType = {
    BasicLayout,
    IFrameView,
  };

  return await generateAccessible(preferences.app.accessMode, {
    ...options,
    fetchMenuListAsync: async () => {
      ElMessage({
        duration: 1500,
        message: `${$t('common.loadingMenu')}...`,
      });
      const routeList = [
        {
          component: 'BasicLayout',
          meta: {
            icon: 'lucide:layout-dashboard',
            order: 1,
            title: 'page.usercenter.title',
          },
          name: 'UserCenter',
          path: '/',
          children: [
            {
              name: 'Company',
              path: '/company',
              component: '/usercenter/company/index.vue',
              meta: {
                affixTab: false,
                icon: 'lucide:area-chart',
                title: 'page.company.title',
              },
            },
            {
              name: 'CompanyDetail',
              path: '/companyDetail/:id',
              component: '/usercenter/company/detail.vue',
              meta: {
                affixTab: false,
                hideInMenu: true,
                title: 'page.company.detail-title',
              },
            },
            {
              name: 'Role',
              path: '/role',
              component: '/usercenter/role/index.vue',
              meta: {
                affixTab: false,
                icon: 'lucide:square-user-round',
                title: 'page.role.title',
              },
            },
            {
              name: 'RoleDetail',
              path: '/roleDetail/:id',
              component: '/usercenter/role/detail.vue',
              meta: {
                affixTab: false,
                hideInMenu: true,
                title: 'page.role.detail-title',
              },
            },
            {
              name: 'User',
              path: '/user',
              component: '/usercenter/user/index.vue',
              meta: {
                affixTab: false,
                icon: 'lucide:user',
                title: 'page.user.title',
              },
            },
            {
              name: 'UserDetail',
              path: '/userDetail/:id',
              component: '/usercenter/user/detail.vue',
              meta: {
                affixTab: false,
                hideInMenu: true,
                title: 'page.user.detail-title',
              },
            },
          ],
        },
        {
          component: 'BasicLayout',
          meta: {
            icon: 'lucide:menu',
            order: 2,
            title: 'page.menuManage.title',
          },
          name: 'menuManage',
          path: '/menu',
          children: [
            {
              name: 'menuList',
              path: '/menulist',
              component: '/menu/menu/index.vue',
              meta: {
                affixTab: false,
                icon: 'lucide:align-start-vertical',
                title: 'page.menu.title',
              },
            },
            {
              name: 'MenuMenuDetail',
              path: '/menuMenuDetail/:id',
              component: '/menu/menu/detail.vue',
              meta: {
                affixTab: false,
                hideInMenu: true,
                title: 'page.menu.detail-title',
              },
            },
          ],
        },
        {
          component: 'BasicLayout',
          meta: {
            icon: 'lucide:database',
            order: 3,
            title: 'page.data-source.title',
          },
          name: 'dataSource',
          path: '/datasource',
          children: [
            {
              name: 'InSource',
              path: '/inSource',
              component: '/datasource/in/index.vue',
              meta: {
                affixTab: false,
                icon: 'lucide:database-zap',
                title: 'page.in-source.title',
              },
            },
            {
              name: 'InSourceDetail',
              path: '/inSourceDetail/:id',
              component: '/datasource/in/detail.vue',
              meta: {
                affixTab: false,
                hideInMenu: true,
                title: 'page.in-source.detail-title',
              },
            },
          ],
        },
        {
          component: 'BasicLayout',
          meta: {
            icon: 'lucide:radio-tower',
            order: 4,
            title: 'terminal.title',
          },
          name: 'terminal',
          path: '/terminal',
          children: [
            {
              name: 'terminalManager',
              path: '/terminalManager',
              component: '/terminal/manager/index.vue',
              meta: {
                affixTab: false,
                icon: 'lucide:layout-list',
                title: 'terminal.terminal.title',
              },
            },
            {
              name: 'terminalDetail',
              path: '/terminalDetail/:id',
              component: '/terminal/manager/detail.vue',
              meta: {
                affixTab: false,
                hideInMenu: true,
                title: 'terminal.terminal.detail',
              },
            },
            {
              name: 'terminalConfig',
              path: '/terminalConfig',
              component: '/terminal/config/index.vue',
              meta: {
                affixTab: false,
                icon: 'lucide:file-sliders',
                title: 'terminal.config.title',
              },
            },
            {
              name: 'terminalConfigDetail',
              path: '/terminalConfigDetail/:id',
              component: '/terminal/config/detail.vue',
              meta: {
                affixTab: false,
                hideInMenu: true,
                title: 'terminal.config.detail',
              },
            },
          ],
        },
        {
          component: 'BasicLayout',
          meta: {
            icon: 'lucide:list-todo',
            order: 4,
            title: 'report.title',
          },
          name: 'report',
          path: '/report',
          children: [
            {
              name: 'reportProject',
              path: '/reportProject',
              component: '/report/project/index.vue',
              meta: {
                affixTab: false,
                icon: 'lucide:file-archive',
                title: 'report.project.title',
              },
            },
            {
              name: 'reportDetail',
              path: '/reportDetail/:id',
              component: '/report/project/detail.vue',
              meta: {
                affixTab: false,
                hideInMenu: true,
                title: 'report.project.detail',
              },
            },
            {
              name: 'reportResult',
              path: '/reportResult',
              component: '/report/result/index.vue',
              meta: {
                affixTab: false,
                icon: 'lucide:file-output',
                title: 'report.result.title',
              },
            },
          ],
        },
        {
          component: 'BasicLayout',
          meta: {
            icon: 'lucide:settings',
            order: 4,
            title: 'system.title',
          },
          name: 'system',
          path: '/system',
          children: [
            {
              name: 'systemSQLconfig',
              path: '/systemSQLconfig',
              component: '/system/sql/index.vue',
              meta: {
                affixTab: false,
                icon: 'lucide:database-backup',
                title: 'system.sql.title',
              },
            },
            {
              name: 'systemMixiotconfig',
              path: '/systemMixiotconfig',
              component: '/system/mixiot/index.vue',
              meta: {
                affixTab: false,
                icon: 'lucide:cloud-cog',
                title: 'system.mixiot.title',
              },
            },
          ],
        },
      ];
      const result = await getUserMenuApi();
      result.forEach((item) => {
        routeList[1]?.children.push({
          component: '/menu/dashboard/index.vue',
          meta: {
            affixTab: false,
            icon: 'lucide:circle-dot',
            title: item?.name,
          },
          name: `DashBoard${item.url}${item.list_order}`,
          path: `/dashBoard/${item.list_order}/${item.url}`,
        });
      });
      return routeList;
    },
    // 可以指定没有权限跳转403页面
    forbiddenComponent,
    // 如果 route.meta.menuVisibleWithForbidden = true
    layoutMap,
    pageMap,
  });
}

export { generateAccess };
