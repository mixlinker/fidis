<script setup lang="ts">
import { onMounted, provide, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useVbenModal } from '@vben/common-ui';

import { ElMessageBox } from 'element-plus';

import { delRoleApi, getRoleListApi } from '#/api';
import mixTableList from '#/components/mix-table-list/index.vue';
import mixTopOperation from '#/components/mix-top-operation/index.vue';
import { $t } from '#/locales';

import bindMenuMoal from './bindMenuModal.vue';
import editModal from './modal.vue';

const router = useRouter();
const tableData = ref<any[]>([]);

const searchOption = reactive({
  fieldKey: 'name',
  option: [
    { label: $t('page.role.name'), value: 'name' },
    { label: $t('common.tag'), value: 'tag' },
  ],
  searchValue: '',
});

interface ParamType {
  page_index: number;
  page_size: number;
  [key: string]: any; // 允许其他动态键
}
const page = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
});
const columns = ref([
  { field: 'name', label: $t('page.role.name'), width: 160 },
  { field: 'tag', label: $t('common.tag'), type: 'tag', width: 160 },
  {
    field: 'is_active',
    label: $t('common.status'),
    option: {
      0: { label: $t('common.stop'), type: 'danger' },
      1: { label: $t('common.start'), type: 'primary' },
    },
    type: 'status',
    width: 160,
  },
  { field: 'list_order', label: $t('common.sort'), width: 160 },
  { field: 'description', label: $t('common.description'), width: 240 },
  { field: 'created_at', label: $t('common.created_at'), width: 180 },
  { field: 'updated_at', label: $t('common.updated_at'), width: 180 },
]);
const getList = async () => {
  const param: ParamType = {
    page_index: page.current,
    page_size: page.pageSize,
  };
  if (searchOption.searchValue) {
    param[searchOption.fieldKey] = searchOption.searchValue;
  }
  const result = await getRoleListApi(param);
  tableData.value = result.data;
  page.total = result.total_records;
};
const pageChange = (current: number, size: number) => {
  page.current = current;
  page.pageSize = size;
  getList();
};
const search = () => {
  page.current = 1;
  getList();
};
/* 添加和编辑弹窗初始化*/
const [Modal, modalApi] = useVbenModal({
  connectedComponent: editModal,
});

/* 绑定菜单弹窗初始化 */

const [MenuModal, menuModalApi] = useVbenModal({
  connectedComponent: bindMenuMoal,
});
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
    icon: 'Reading',
    name: $t('page.role.bind-menu'),
    type: 'bindMenu',
  },
  {
    icon: 'Delete',
    name: $t('common.delete'),
    type: 'delete',
  },
]);

const rightFunction = {
  bindMenu: async (row: any) => {
    menuModalApi.setData(row);
    menuModalApi.open();
  },
  delete: (row: any) => {
    ElMessageBox.confirm($t('message.delete'), {
      type: 'warning',
    }).then(async () => {
      await delRoleApi({ id: row.id });
      getList();
    });
  },
  item: (row: any) => {
    router.push(`/roleDetail/${row.id}`);
  },
  update: async (row: any) => {
    modalApi.setData(row);
    modalApi.open();
  },
};
const commands = ref([
  {
    type: 'create',
  },
]);
onMounted(() => {
  getList();
});

provide('getList', getList);
defineExpose({ createModal, pageChange, rightFunction });
</script>

<template>
  <div class="p-3">
    <mixTopOperation
      :command="commands"
      :search-option="searchOption"
      @search="search"
    />
    <mixTableList
      :columns="columns"
      :local-buttons="rightButton"
      :pager="page"
      :table-data="tableData"
      list-name="role_list"
    />
    <Modal />
    <MenuModal />
  </div>
</template>
