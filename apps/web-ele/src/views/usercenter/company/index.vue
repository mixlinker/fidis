<script setup lang="ts">
import { onMounted, provide, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useVbenModal } from '@vben/common-ui';

import { ElMessageBox } from 'element-plus';

import { delCompanyApi, getCompanyListApi } from '#/api';
import mixTableList from '#/components/mix-table-list/index.vue';
import mixTopOperation from '#/components/mix-top-operation/index.vue';
import { $t } from '#/locales';
import { createRouterGuard } from '#/router/guard';

import editModal from './modal.vue';

const router = useRouter();

const tableData = ref<any[]>([]);

const searchOption = reactive({
  fieldKey: 'name',
  option: [
    { label: $t('page.company.name'), value: 'name' },
    { label: $t('common.tag'), value: 'tag' },
  ],
  searchValue: '',
});

interface ParamType {
  page_index: number;
  page_size: number;
  [key: string]: any;
}
const page = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
});
const getList = async () => {
  const param: ParamType = {
    page_index: page.current,
    page_size: page.pageSize,
  };
  if (searchOption.searchValue) {
    param[searchOption.fieldKey] = searchOption.searchValue;
  }
  const result = await getCompanyListApi(param);
  tableData.value = result.data;
  page.total = result.total_records;
};

const pageChange = (current: number, size: number) => {
  page.current = current;
  page.pageSize = size;
  getList();
};
/* 添加和编辑弹窗初始化*/
const [Modal, modalApi] = useVbenModal({
  connectedComponent: editModal,
});
const columns = ref([
  { field: 'name', label: $t('page.company.name') },
  { field: 'tag', label: $t('common.tag'), type: 'tag' },
  {
    field: 'is_active',
    label: $t('common.status'),
    option: {
      0: { label: $t('common.stop'), type: 'danger' },
      1: { label: $t('common.start'), type: 'primary' },
    },
    type: 'status',
  },
  { field: 'list_order', label: $t('common.sort') },
  { field: 'created_at', label: $t('common.created_at') },
  { field: 'updated_at', label: $t('common.updated_at') },
]);
/* 添加 */
const createModal = () => {
  modalApi.setData('');
  modalApi.open();
};

/* 右键菜单 */
const rightButton = ref([
  {
    icon: 'Postcard',
    name: $t('common.detail'),
    type: 'item',
  },
  {
    icon: 'Edit',
    name: $t('common.edit'),
    type: 'update',
  },
  {
    icon: 'Delete',
    name: $t('common.delete'),
    type: 'delete',
  },
]);

const rightFunction = {
  delete: (row: any) => {
    ElMessageBox.confirm($t('common.message.delete'), {
      type: 'warning',
    }).then(async () => {
      await delCompanyApi({ id: row.id });
      getList();
    });
  },
  item: (row: any) => {
    router.push(`/companyDetail/${row.id}`);
  },
  update: async (row: any) => {
    modalApi.setData(row);
    modalApi.open();
  },
};

onMounted(() => {
  getList();
  router.addRoute('UserCenter', {
    component: () => import('#/views/usercenter/company/index.vue'),
    meta: {
      affixTab: false,
      icon: 'lucide:area-chart',
      title: '测试',
    },
    name: 'About',
    path: '/about',
  });
  // 创建路由守卫
  createRouterGuard(router);
});

provide('getList', getList);
defineExpose({ createModal, pageChange, rightFunction });
</script>

<template>
  <div class="p-3">
    <mixTopOperation :search-option="searchOption" />
    <mixTableList
      :columns="columns"
      :local-buttons="rightButton"
      :pager="page"
      :table-data="tableData"
    />
    <Modal />
  </div>
</template>
