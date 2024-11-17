<script setup lang="ts">
import { onMounted, provide, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

import { useWindowSize } from '@vueuse/core';

import { getTerminalListApi } from '#/api';
import mixTableList from '#/components/mix-table-list/index.vue';
import mixTopOperation from '#/components/mix-top-operation/index.vue';
import { $t } from '#/locales';

const route = useRoute();
const tableData = ref<any[]>([]);

const searchOption = reactive({
  fieldKey: 'name',
  option: [
    { label: $t('terminal.terminal.name'), value: 'name' },
    { label: $t('terminal.terminal.uid'), value: 'uid' },
    { label: $t('terminal.terminal.alias'), value: 'alias' },
    { label: $t('terminal.terminal.maker'), value: 'maker' },
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
    where_and: [['config_id', '=', route.params.id]],
  };
  if (searchOption.searchValue) {
    param.where_and.push([
      searchOption.fieldKey,
      'like',
      `%${searchOption.searchValue}%`,
    ]);
  }
  const result = await getTerminalListApi(param);
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
    field: 'uid',
    label: $t('terminal.terminal.uid'),
    width: 160,
  },
  {
    field: 'name',
    label: $t('terminal.terminal.name'),
    width: 160,
  },
  {
    field: 'alias',
    label: $t('terminal.terminal.alias'),
    width: 160,
  },
  {
    field: 'type',
    label: $t('terminal.terminal.type'),
    width: 160,
  },
  {
    field: 'config_id',
    label: $t('terminal.terminal.config_id'),
    width: 160,
  },
  {
    field: 'online',
    label: $t('terminal.terminal.online'),
    option: {
      0: { label: $t('terminal.terminal.offline_status'), type: 'danger' },
      1: { label: $t('terminal.terminal.online_status'), type: 'primary' },
    },
    type: 'status',
    width: 100,
  },
  {
    field: 'csq',
    label: $t('terminal.terminal.csq'),
    width: 160,
  },
  {
    field: 'last_online_time',
    label: $t('terminal.terminal.last_online_time'),
    width: 160,
  },
  {
    field: 'nominal.ICCID',
    label: $t('terminal.terminal.iccid'),
    width: 160,
  },
  {
    field: 'maker',
    label: $t('terminal.terminal.maker'),
    width: 160,
  },
  {
    field: 'description',
    label: $t('common.description'),
    width: 240,
  },
  {
    field: 'created',
    fixed: 'right',
    label: $t('terminal.terminal.created'),
    width: 160,
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
defineExpose({ pageChange, search });
</script>

<template>
  <div>
    <mixTopOperation :search-option="searchOption" />
    <mixTableList
      :columns="columns"
      :local-buttons="[]"
      :pager="page"
      :t-height="height - 292"
      :table-data="tableData"
    />
  </div>
</template>
