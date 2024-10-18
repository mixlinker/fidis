<script setup lang="ts">
import { computed, onMounted, provide, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

import { Search } from '@element-plus/icons-vue';
import { useWindowSize } from '@vueuse/core';

import { getDataSourceResultApi } from '#/api';
import { $t } from '#/locales';

const route = useRoute();
const { height } = useWindowSize();
const TableMaxH = computed(() => {
  return height.value - 234;
});
const tableData = ref<any[]>();

const searchOption = reactive({
  fieldKey: 'object_id',
  option: [
    { label: $t('common.object_uid'), value: 'object_id' },
    { label: $t('page.in-source.statistics.name'), value: 'name' },
    { label: $t('page.in-source.statistics.alias'), value: 'alias' },
  ],
  searchValue: '',
});
const page = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0,
});

interface ParamType {
  id: number;
  page_index: number;
  page_size: number;
  [key: string]: any;
  where_and: string;
}

const getList = async () => {
  const param: ParamType = {
    id: Number(route.params.id),
    page_index: page.currentPage,
    page_size: page.pageSize,
    where_and: '',
  };
  if (searchOption.searchValue) {
    param.where_and = JSON.stringify([
      [searchOption.fieldKey, 'like', `%${searchOption.searchValue}%`],
    ]);
  }
  const result = await getDataSourceResultApi(param);
  tableData.value = result.data;
  page.total = result.total_records;
};

const handleSizeChange = () => {
  page.currentPage = 1;
  getList();
};

const handleCurrentChange = (val: number) => {
  page.currentPage = val;
  getList();
};

onMounted(() => {
  route.meta.title = $t('page.in-source.statistics.title');
  getList();
});

provide('getList', getList);
</script>

<template>
  <div class="p-3">
    <div class="mb-3">
      <el-select
        v-model="searchOption.fieldKey"
        class="mr-[12px]"
        style="width: 120px"
      >
        <el-option
          v-for="item in searchOption.option"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input
        v-model="searchOption.searchValue"
        :placeholder="$t('common.pleaseEnter')"
        class="mr-[12px]"
        clearable
        style="width: 240px"
        @keyup.enter="getList"
      />
      <el-button :icon="Search" @click="handleSizeChange">
        {{ $t('common.search') }}
      </el-button>
    </div>
    <el-table
      :data="tableData"
      :max-height="TableMaxH"
      :style="{ height: `${TableMaxH}px` }"
      border
      style="width: 100%"
    >
      <el-table-column
        :label="$t('page.in-source.statistics.name')"
        prop="name"
      />
      <el-table-column
        :label="$t('page.in-source.statistics.alias')"
        prop="alias"
      />
      <el-table-column :label="$t('common.object_uid')" prop="object_id" />
      <el-table-column :label="$t('common.start_time')" prop="created_at" />
      <el-table-column :label="$t('common.end_time')" prop="created_at" />
      <el-table-column :label="$t('common.created_at')" prop="created_at" />
    </el-table>
    <div class="mt-[12px] flex justify-end">
      <el-pagination
        v-model:current-page="page.currentPage"
        v-model:page-size="page.pageSize"
        :page-sizes="[20, 50, 100, 200]"
        :total="page.total"
        layout="total,prev, pager, next, sizes,jumper"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<style scoped>
.el-table {
  /* border: 0.5px solid #babfc7; */
}
</style>
