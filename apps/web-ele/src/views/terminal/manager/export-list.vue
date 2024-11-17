<script setup lang="ts">
import { getCurrentInstance, onMounted, provide, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

import { useWindowSize } from '@vueuse/core';

import { getExportListApi } from '#/api';
import mixTableList from '#/components/mix-table-list/index.vue';
import mixTopOperation from '#/components/mix-top-operation/index.vue';
import { $t } from '#/locales';

const { proxy } = getCurrentInstance() as any;
const route = useRoute();
const tableData = ref<any[]>([]);

const searchOption = reactive({
  fieldKey: 'name',
  option: [
    { label: $t('terminal.grid.file_name'), value: 'name' },
    { label: $t('common.status'), value: 'state' },
  ],
  searchValue: '',
});

const commands = ref([
  {
    type: 'export',
  },
]);

/* 右键菜单 */
const rightButton = ref([
  {
    icon: 'Download',
    name: $t('common.download'),
    type: 'download',
  },
]);
const rightFunction = {};

const handleExport = () => {
  proxy.$parent.handleExport();
};

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
    where_and: [
      ['typ', '=', 'grid'],
      ['terminal_id', '=', route.params.id],
    ],
  };

  if (searchOption.searchValue) {
    param.where_and = [
      [searchOption.fieldKey, 'like', `%${searchOption.searchValue}%`],
    ];
  }
  const result = await getExportListApi(param);
  tableData.value = result.data;
  page.total = result.total_records;
};

const pageChange = (current: number, size: number) => {
  page.current = current;
  page.pageSize = size;
  getList();
};
const columns = ref([
  {
    field: 'file',
    label: $t('terminal.grid.file_name'),
  },
  {
    field: 'data_start',
    label: $t('terminal.grid.start_time'),
    width: 180,
  },
  {
    field: 'data_end',
    label: $t('terminal.grid.start_time'),
    width: 180,
  },
  {
    field: 'state',
    label: $t('common.status'),
    option: {
      Executing: { label: $t('common.in_execution'), type: 'primary' },
      Fail: { label: $t('common.failing'), type: 'danger' },
      Success: { label: $t('common.success'), type: 'success' },
      Wait: { label: $t('common.watting'), type: 'info' },
    },
    type: 'status',
  },
]);

const search = () => {
  page.current = 1;
  getList();
};

const { height } = useWindowSize();

onMounted(() => {
  getList();
});

provide('getList', getList);
defineExpose({ handleExport, pageChange, rightFunction, search });
</script>

<template>
  <div>
    <mixTopOperation :command="commands" :search-option="searchOption" />
    <mixTableList
      :columns="columns"
      :local-buttons="rightButton"
      :pager="page"
      :t-height="height - 292"
      :table-data="tableData"
    />
  </div>
</template>
