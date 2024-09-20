<script setup lang="ts">
import { computed, onMounted, provide, reactive, ref } from 'vue';

import { Search } from '@element-plus/icons-vue';
import { useWindowSize } from '@vueuse/core';
import { ElMessageBox } from 'element-plus';

import {
  getInDataSourceApi,
  startDataSourceApi,
  stopDataSourceApi,
} from '#/api';
import mixRightMenu from '#/components/mix-right-menu/index.vue';
import { $t } from '#/locales';

const { height } = useWindowSize();
const TableMaxH = computed(() => {
  return height.value - 234;
});
const tableData = ref<any[]>();

const searchOption = reactive({
  fieldKey: 'name',
  option: [{ label: $t('page.in-source.name'), value: 'name' }],
  searchValue: '',
});
const page = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0,
});

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

const handleSizeChange = () => {
  page.currentPage = 1;
  getList();
};

const handleCurrentChange = (val: number) => {
  page.currentPage = val;
  getList();
};
/* 右键菜单 */
const rightMenuRef = ref<any>(null);
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
]);

const rightFunction = {
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

type RightFunctionType = keyof typeof rightFunction;
const rowContextmenu = (row: any) => {
  rightMenuRef.value.showRightMenu(row);
};

const rightClick = (data: { row: any; type: RightFunctionType }) => {
  rightFunction[data.type](data.row);
};

onMounted(() => {
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
      <el-button :icon="Search" @click="getList">
        {{ $t('common.search') }}
      </el-button>
    </div>
    <el-table
      :data="tableData"
      :max-height="TableMaxH"
      :style="{ height: `${TableMaxH}px` }"
      border
      style="width: 100%"
      @row-contextmenu="rowContextmenu"
    >
      <el-table-column :label="$t('page.in-source.name')" prop="name" />
      <el-table-column :label="$t('page.in-source.type')" prop="type" />
      <el-table-column :label="$t('common.status')" prop="is_active">
        <template #default="scope">
          <div>
            {{
              scope.row.is_active === 1 ? $t('common.start') : $t('common.stop')
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.created_at')" prop="created_at" />
      <el-table-column :label="$t('common.updated_at')" prop="updated_at" />
    </el-table>
    <mixRightMenu
      ref="rightMenuRef"
      :local-buttons="rightButton"
      @right-click="rightClick"
    />
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
