[
  {
    component: 'BasicLayout',
    meta: {
      order: -1,
      title: 'page.dashboard.title',
    },
    name: 'Dashboard',
    path: '/',
    redirect: '/analytics',
    children: [
      {
        name: 'Analytics',
        path: '/analytics',
        component: '/dashboard/analytics/index',
        meta: {
          affixTab: true,
          title: 'page.dashboard.analytics',
        },
      },
      {
        name: 'Workspace',
        path: '/workspace',
        component: '/dashboard/workspace/index',
        meta: {
          title: 'page.dashboard.workspace',
        },
      },
    ],
  },
  {
    component: 'BasicLayout',
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: 'page.demos.title',
    },
    name: 'Demos',
    path: '/demos',
    redirect: '/demos/access',
    children: [
      {
        name: 'AccessDemos',
        path: '/demosaccess',
        meta: {
          icon: 'mdi:cloud-key-outline',
          title: 'page.demos.access.backendPermissions',
        },
        redirect: '/demos/access/page-control',
        children: [
          {
            name: 'AccessPageControlDemo',
            path: '/demos/access/page-control',
            component: '/demos/access/index',
            meta: {
              icon: 'mdi:page-previous-outline',
              title: 'page.demos.access.pageAccess',
            },
          },
          {
            name: 'AccessButtonControlDemo',
            path: '/demos/access/button-control',
            component: '/demos/access/button-control',
            meta: {
              icon: 'mdi:button-cursor',
              title: 'page.demos.access.buttonControl',
            },
          },
          {
            name: 'AccessMenuVisible403Demo',
            path: '/demos/access/menu-visible-403',
            component: '/demos/access/menu-visible-403',
            meta: {
              authority: ['no-body'],
              icon: 'mdi:button-cursor',
              menuVisibleWithForbidden: true,
              title: 'page.demos.access.menuVisible403',
            },
          },
          {
            component: '/demos/access/super-visible',
            meta: {
              icon: 'mdi:button-cursor',
              title: 'page.demos.access.superVisible',
            },
            name: 'AccessSuperVisibleDemo',
            path: '/demos/access/super-visible',
          },
        ],
      },
    ],
  },
];
