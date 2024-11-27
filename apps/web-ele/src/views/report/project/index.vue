<script setup lang="ts">
import { onMounted, provide, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useVbenModal } from '@vben/common-ui';

import { ElMessageBox } from 'element-plus';

import { delReportApi, getReportListApi } from '#/api';
import mixTableList from '#/components/mix-table-list/index.vue';
import mixTopOperation from '#/components/mix-top-operation/index.vue';
import { $t } from '#/locales';
import config from '#/utils/config';

import editModal from './modal.vue';

const router = useRouter();
const tableData = ref<any[]>([]);
const searchOption = reactive({
  fieldKey: 'name',
  option: [
    { label: $t('page.menu.name'), value: 'name' },
    { label: $t('common.tag'), value: 'tag' },
  ],
  searchValue: '',
});
const page = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
});

interface ParamType {
  page_index: number;
  page_size: number;
  [key: string]: any; // 允许其他动态键
}

const getList = async () => {
  const param: ParamType = {
    page_index: page.current,
    page_size: page.pageSize,
  };
  if (searchOption.searchValue) {
    param[searchOption.fieldKey] = searchOption.searchValue;
  }
  const result = await getReportListApi(param);
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

/* 添加 */
const createModal = () => {
  modalApi.setData('');
  modalApi.open();
};
const columns = ref([
  { field: 'plan_name', label: $t('report.project.name') },
  { field: 'uid', label: $t('report.project.uid') },
  { field: 'alias', label: $t('report.project.alias') },
  {
    field: 'plan_type',
    formatter: (row: any) => {
      return config.reportTypes[row.plan_type];
    },
    label: $t('report.project.report_type'),
  },
  {
    field: 'run_type',
    formatter: (row: any) => {
      return config.executeOption[row.run_type];
    },
    label: $t('report.project.run_mode'),
  },
  {
    field: 'is_active',
    label: $t('report.project.status'),
    option: {
      0: $t('common.close'),
      1: $t('common.open'),
    },
    type: 'status',
  },
  { field: 'plan_description', label: $t('common.description') },
  { field: 'last_modified', label: $t('common.updated_at') },
  { field: 'created', label: $t('common.created_at') },
]);
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
    ElMessageBox.confirm($t('message.delete'), {
      type: 'warning',
    }).then(async () => {
      await delReportApi({ id: row.id });
      getList();
    });
  },
  item: (row: any) => {
    router.push(`/reportDetail/${row.id}`);
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
    <mixTopOperation :command="commands" :search-option="searchOption" />
    <mixTableList
      :columns="columns"
      :local-buttons="rightButton"
      :pager="page"
      :table-data="tableData"
      list-name="report_project_list"
    />
    <Modal />
  </div>
</template>
