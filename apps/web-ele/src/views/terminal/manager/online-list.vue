<script setup lang="ts">
import { onMounted, provide, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

import { useWindowSize } from '@vueuse/core';

import { getTerminalOnlineApi } from '#/api';
import mixTableList from '#/components/mix-table-list/index.vue';
import { $t } from '#/locales';

const route = useRoute();
const tableData = ref<any[]>([]);

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
    terminal_id: route.params.id,
    topic: ['connected', 'disconnected'],
  };
  const result = await getTerminalOnlineApi(param);
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
    field: 'topic',
    label: $t('terminal.grid.status'),
    option: {
      connected: { label: $t('terminal.grid.online'), type: 'primary' },
      disconnected: { label: $t('terminal.grid.offline'), type: 'danger' },
    },
    type: 'status',
    width: 160,
  },
  {
    field: 'payload.reason',
    label: $t('terminal.grid.payload_desc'),
  },
  {
    field: 'time',
    label: $t('terminal.grid.occurrence_time'),
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
    <mixTableList
      :columns="columns"
      :local-buttons="[]"
      :pager="page"
      :t-height="height - 248"
      :table-data="tableData"
    />
  </div>
</template>
