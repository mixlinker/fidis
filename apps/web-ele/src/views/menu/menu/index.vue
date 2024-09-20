<script setup lang="ts">
import { computed, onMounted, provide, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useVbenModal } from '@vben/common-ui';

import { Plus, Search } from '@element-plus/icons-vue';
import { useWindowSize } from '@vueuse/core';
import { ElMessageBox } from 'element-plus';

import { delMenuApi, getMenuListApi } from '#/api';
import mixRightMenu from '#/components/mix-right-menu/index.vue';
import { $t } from '#/locales';

import editModal from './modal.vue';

const router = useRouter();
const { height } = useWindowSize();
const TableMaxH = computed(() => {
  return height.value - 234;
});
const tableData = ref<any[]>();

const searchOption = reactive({
  fieldKey: 'name',
  option: [
    { label: $t('page.menu.name'), value: 'name' },
    { label: $t('common.tag'), value: 'tag' },
  ],
  searchValue: '',
});
const page = reactive({
  currentPage: 1,
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
    page_index: page.currentPage,
    page_size: page.pageSize,
  };
  if (searchOption.searchValue) {
    param[searchOption.fieldKey] = searchOption.searchValue;
  }
  const result = await getMenuListApi(param);
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
/* 添加和编辑弹窗初始化*/
const [Modal, modalApi] = useVbenModal({
  connectedComponent: editModal,
});

/* 添加 */
const createModal = () => {
  modalApi.setData('');
  modalApi.open();
};

/* 右键菜单 */
const rightMenuRef = ref<any>(null);
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
      await delMenuApi({ id: row.id });
      getList();
    });
  },
  item: (row: any) => {
    router.push(`/menuMenuDetail/${row.id}`);
  },
  update: async (row: any) => {
    modalApi.setData(row);
    modalApi.open();
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
      <el-button :icon="Plus" type="primary" @click="createModal">
        {{ $t('common.add') }}
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
      <el-table-column :label="$t('page.menu.name')" prop="name" />
      <el-table-column :label="$t('common.tag')" prop="tag">
        <template #default="scope">
          <el-tag
            v-for="(item, index) in scope.row.tag"
            :key="index"
            class="mr-1"
            type="primary"
          >
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.sort')" prop="list_order" />
      <el-table-column
        :label="$t('common.description')"
        prop="description"
        show-overflow-tooltip
      />
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

    <Modal />
  </div>
</template>

<style scoped>
.el-table {
  /* border: 0.5px solid #babfc7; */
}
</style>
