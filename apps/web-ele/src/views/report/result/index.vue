<script setup lang="ts">
import { onMounted, provide, reactive, ref } from 'vue';

import { ElMessage, ElMessageBox } from 'element-plus';

import { delReportResultListApi, getReportResultApi } from '#/api';
import mixTableList from '#/components/mix-table-list/index.vue';
import mixTopOperation from '#/components/mix-top-operation/index.vue';
import { $t } from '#/locales';
import config from '#/utils/config';

const tableData = ref<any[]>([]);
const searchOption = reactive({
  fieldKey: 'uid',
  option: [
    { label: $t('report.result.uid'), value: 'uid' },
    { label: $t('report.project.uid'), value: 'plan_uid' },
    {
      label: $t('report.result.status'),
      option: [
        { label: $t('common.success'), value: 1 },
        { label: $t('common.failing'), value: 2 },
        { label: $t('common.in_execution'), value: 0 },
      ],
      type: 'select',
      value: 'status',
    },
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
    param.where_and = [
      [searchOption.fieldKey, 'like', `%${searchOption.searchValue}%`],
    ];
  }
  const result = await getReportResultApi(param);
  tableData.value = result.data;
  page.total = result.total_records;
};

const pageChange = (current: number, size: number) => {
  page.current = current;
  page.pageSize = size;
  getList();
};

const columns = ref([
  { field: 'uid', label: $t('report.result.uid'), width: 180 },
  { field: 'plan_uid', label: $t('report.project.uid'), width: 180 },
  { field: 'project_name', label: $t('report.project.name'), width: 180 },
  {
    field: 'plan_type',
    formatter: (row: any) => {
      return config.reportTypes[row.plan_type];
    },
    label: $t('report.project.report_type'),
    width: 180,
  },
  {
    field: 'status',
    label: $t('report.result.status'),
    option: {
      0: { label: $t('common.in_execution'), type: 'primary' },
      1: { label: $t('common.success'), type: 'success' },
      2: { label: $t('common.failing'), type: 'danger' },
    },
    type: 'status',
    width: 180,
  },
  { field: 'created', label: $t('common.created_at'), width: 180 },
]);
/* 右键菜单 */
const rightButton = ref([
  {
    icon: 'Download',
    name: $t('common.download'),
    type: 'download',
  },
  {
    icon: 'View',
    name: $t('common.preview'),
    type: 'preview',
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
      await delReportResultListApi({ uid: row.uid });
      getList();
    });
  },
  download: (row: any) => {
    const path = `${window.location.origin}/fidis/download/${row.file_path}`;
    window.open(path);
  },
  preview: (row: any) => {
    if (row.file_path) {
      const path = `${location.origin}/mixservice/storage/mixreport/${row.file_path}`;
      const url = `https://view.officeapps.live.com/op/view.aspx?src=${path}`;
      window.open(url);
    } else {
      ElMessage.error($t('message.undefined_file'));
    }
  },
};
const search = () => {
  page.current = 1;
  getList();
};
onMounted(() => {
  getList();
});

provide('getList', getList);
defineExpose({ pageChange, rightFunction });
</script>

<template>
  <div class="p-3">
    <mixTopOperation :search-option="searchOption" @search="search" />
    <mixTableList
      :columns="columns"
      :local-buttons="rightButton"
      :pager="page"
      :table-data="tableData"
      list-name="report_result_list"
    />
  </div>
</template>
