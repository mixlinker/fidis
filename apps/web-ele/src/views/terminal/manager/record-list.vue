<script setup lang="ts">
import { getCurrentInstance, onMounted, provide, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

import { FolderOpened, Search } from '@element-plus/icons-vue';
import { useWindowSize } from '@vueuse/core';
import dayjs from 'dayjs';

import { getTerminalOnlineApi } from '#/api';
import mixTableList from '#/components/mix-table-list/index.vue';
import { $t } from '#/locales';

const { proxy } = getCurrentInstance() as any;
const route = useRoute();
const tableData = ref<any[]>([]);

const fieldKey = ref<string>('all');
const searchOption = reactive([
  { label: $t('terminal.grid.all_topic'), value: 'all' },
  { label: $t('terminal.grid.r_topic'), value: 'r' },
  { label: $t('terminal.grid.i_topic'), value: 'i' },
  { label: $t('terminal.grid.n_topic'), value: 'n' },
  { label: $t('terminal.grid.d_topic'), value: 'd' },
  { label: $t('terminal.grid.e_topic'), value: 'e' },
  {
    label: $t('terminal.grid.connected_topic'),
    value: 'connected',
  },
  {
    label: $t('terminal.grid.disconnected_topic'),
    value: 'disconnected',
  },
]);

const rangeTime = ref<string[]>([
  dayjs().startOf('hour').format('YYYY-MM-DD HH:mm:ss'),
  dayjs().endOf('hour').format('YYYY-MM-DD HH:mm:ss'),
]);

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
    topic: [],
  };
  const topic = [];
  if (fieldKey.value !== 'all') {
    topic.push(fieldKey.value);
  }
  if (rangeTime.value.length > 0) {
    param.start_time = rangeTime.value[0];
    param.end_time = rangeTime.value[1];
  }
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
    field: 'time',
    label: $t('terminal.grid.collect_time'),
    width: 160,
  },
  {
    field: 'topic',
    label: $t('terminal.grid.topic'),
    width: 160,
  },
  {
    field: 'payload',
    formatter: (row: any) => {
      return JSON.stringify(row.payload);
    },
    label: $t('terminal.grid.payload'),
  },
]);

const search = () => {
  page.current = 1;
  getList();
};

const { height } = useWindowSize();

const handleExport = () => {
  proxy.$parent.handleExport();
};

onMounted(() => {
  getList();
});

provide('getList', getList);
defineExpose({ handleExport, pageChange, search });
</script>

<template>
  <div>
    <div class="mb-[12px] flex">
      <el-select v-model="fieldKey" class="mr-[12px]" style="width: 120px">
        <el-option
          v-for="item in searchOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <div class="mr-[12px]">
        <el-date-picker
          v-model="rangeTime"
          :end-placeholder="$t('terminal.grid.end_time')"
          :start-placeholder="$t('terminal.grid.start_time')"
          range-separator="-"
          type="datetimerange"
        />
      </div>
      <el-button :icon="Search" @click="search">
        {{ $t('common.search') }}
      </el-button>
      <el-button :icon="FolderOpened" type="primary" @click="handleExport">
        {{ $t('common.export') }}
      </el-button>
    </div>
    <mixTableList
      :columns="columns"
      :local-buttons="[]"
      :pager="page"
      :t-height="height - 292"
      :table-data="tableData"
    />
  </div>
</template>
