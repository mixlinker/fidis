<script setup lang="ts">
import { onMounted, provide, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { ElMessageBox } from 'element-plus';

import { delReportApi, getMenuListApi } from '#/api';
import mixTableList from '#/components/mix-table-list/index.vue';
import mixTopOperation from '#/components/mix-top-operation/index.vue';
import { $t } from '#/locales';

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
  const result = await getMenuListApi(param);
  tableData.value = result.data;
  page.total = result.total_records;
};

const pageChange = (current: number, size: number) => {
  page.current = current;
  page.pageSize = size;
  getList();
};

const columns = ref([
  { field: 'name', label: $t('page.company.name') },
  { field: 'tag', label: $t('common.tag'), type: 'tag' },
  { field: 'list_order', label: $t('common.sort') },
  { field: 'created_at', label: $t('common.created_at') },
  { field: 'updated_at', label: $t('common.updated_at') },
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
};
onMounted(() => {
  getList();
});

provide('getList', getList);
defineExpose({ pageChange, rightFunction });
</script>

<template>
  <div class="p-3">
    <mixTopOperation :search-option="searchOption" />
    <mixTableList
      :columns="columns"
      :local-buttons="rightButton"
      :pager="page"
      :table-data="tableData"
      list-name="report_result_list"
    />
    <Modal />
  </div>
</template>
