[
  {
    meta: {
      icon: 'lucide:layout-dashboard',
      order: -1,
      title: 'page.usercenter.title',
    },
    name: 'UserCenter',
    path: '/',
    children: [
      {
        name: 'Company',
        path: '/company',
        meta: {
          affixTab: true,
          icon: 'lucide:area-chart',
          title: 'page.company.title',
        },
      },
      {
        name: 'CompanyDetail',
        path: '/companyDetail/:id',
        meta: {
          affixTab: false,
          hideInMenu: true,
          title: 'page.company.detail-title',
        },
      },
      {
        name: 'Role',
        path: '/role',
        meta: {
          affixTab: false,
          icon: 'lucide:square-user-round',
          title: 'page.role.title',
        },
      },
      {
        name: 'RoleDetail',
        path: '/roleDetail/:id',
        meta: {
          affixTab: false,
          hideInMenu: true,
          title: 'page.role.detail-title',
        },
      },
      {
        name: 'User',
        path: '/user',
        meta: {
          affixTab: false,
          icon: 'lucide:user',
          title: 'page.user.title',
        },
      },
      {
        name: 'UserDetail',
        path: '/userDetail/:id',
        meta: {
          affixTab: false,
          hideInMenu: true,
          title: 'page.user.detail-title',
        },
      },
    ],
  },
];
