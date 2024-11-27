<script setup lang="ts">
import { onMounted, provide, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { ElMessageBox } from 'element-plus';

import {
  getInDataSourceApi,
  startDataSourceApi,
  stopDataSourceApi,
} from '#/api';
import mixTableList from '#/components/mix-table-list/index.vue';
import mixTopOperation from '#/components/mix-top-operation/index.vue';
import { $t } from '#/locales';

const router = useRouter();
const tableData = ref<any[]>([]);

const searchOption = reactive({
  fieldKey: 'name',
  option: [{ label: $t('page.in-source.name'), value: 'name' }],
  searchValue: '',
});
const page = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
});
const columns = ref([
  { field: 'name', label: $t('page.in-source.name'), width: 180 },
  { field: 'type', label: $t('page.in-source.type'), width: 160 },
  {
    field: 'is_active',
    label: $t('common.status'),
    option: {
      0: { label: $t('common.stop'), type: 'danger' },
      1: { label: $t('common.start'), type: 'primary' },
    },
    type: 'status',
    width: 180,
  },
  { field: 'created_at', label: $t('common.created_at'), width: 180 },
  { field: 'updated_at', label: $t('common.updated_at'), width: 180 },
]);
const getList = async () => {
  const result = await getInDataSourceApi();
  tableData.value = result;
  if (searchOption.searchValue) {
    tableData.value = result.filter((item) =>
      item.name.includes(searchOption.searchValue),
    );
  }
  page.total = result.length;
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
/* 右键菜单 */
const rightButton = ref([
  {
    icon: 'VideoPlay',
    name: $t('common.start'),
    type: 'start',
  },
  {
    icon: 'VideoPause',
    name: $t('common.stop'),
    type: 'stop',
  },
  {
    icon: 'Postcard',
    name: $t('common.detail'),
    type: 'item',
  },
]);

const rightFunction = {
  item: (row: any) => {
    router.push(`/inSourceDetail/${row.id}`);
  },
  start: async (row: any) => {
    ElMessageBox.confirm($t('page.in-source.message.confirm-stop'), {
      type: 'warning',
    }).then(async () => {
      await startDataSourceApi({ id: row.id });
      getList();
    });
  },
  stop: async (row: any) => {
    ElMessageBox.confirm($t('page.in-source.message.confirm-start'), {
      type: 'warning',
    }).then(async () => {
      await stopDataSourceApi({ id: row.id });
      getList();
    });
  },
};
const commands = ref([]);
onMounted(() => {
  getList();
});
provide('getList', getList);
defineExpose({ pageChange, rightFunction });
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
      list-name="datasource_list"
    />
  </div>
</template>
