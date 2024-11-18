<script lang="ts" setup>
import type { configItemType } from '../manager/types';

import { onMounted, reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage, type TableInstance } from 'element-plus';

import { getTerminalListApi, upgradeLuaApi } from '#/api';
import mixTopOperation from '#/components/mix-top-operation/index.vue';
import { $t } from '#/locales';

const modal = reactive({
  config_id: '',
});
const searchOption = reactive({
  fieldKey: 'name',
  option: [
    { label: $t('terminal.terminal.name'), value: 'name' },
    { label: $t('terminal.terminal.uid'), value: 'uid' },
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
  [key: string]: any;
}
const tHeight = ref<number>(400);
const tableData = ref<any[]>([]);
const getList = async () => {
  const param: ParamType = {
    page_index: page.current,
    page_size: page.pageSize,
    where_and: [['config_id', '=', modal.config_id]],
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

const multipleTableRef = ref<TableInstance>();
const multipleSelection = ref<configItemType[]>([]);
const handleSelectionChange = (val: configItemType[]) => {
  multipleSelection.value = val;
};

const pageChange = () => {};
/* 初始化弹窗 */
const [Modal, modalApi] = useVbenModal({
  onBeforeClose: () => {},
  onConfirm: async () => {
    const group = multipleSelection.value.map((ele: configItemType) => {
      const obj = {
        type: ele.type,
        uid: ele.uid,
      };
      return obj;
    });
    const data = {
      terminal_group: group,
      uid: modal.config_id,
      value: 'LUA',
    };
    const result = await upgradeLuaApi(data);
    result && ElMessage.success($t('common.success'));
    modalApi.close();
  },
  onOpenChange: async (isOpen) => {
    if (isOpen) {
      getList();
    }
  },
});

const selectAll = async () => {
  const param: ParamType = {
    page_index: 1,
    page_size: 999,
    where_and: [['config_id', '=', modal.config_id]],
  };
  const result = await getTerminalListApi(param);
  result && (multipleSelection.value = result.data);
  multipleTableRef.value?.toggleAllSelection();
};

onMounted(() => {
  tHeight.value = document.body.clientHeight * 0.75 - 200;
});

defineExpose({ modal, modalApi });
</script>

<template>
  <Modal :centered="true" :title="$t('common.batch_upgrade')" class="w-[50%]">
    <div class="flex">
      <mixTopOperation :command="[]" :search-option="searchOption" />
      <el-button class="ml-[12px]" type="primary" @click="selectAll">
        {{ $t('common.select_all') }}
      </el-button>
    </div>
    <el-table
      ref="multipleTableRef"
      :data="tableData"
      :max-height="tHeight"
      :style="{ height: `${tHeight}px` }"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column
        :label="$t('terminal.terminal.uid')"
        prop="uid"
        width="180"
      />
      <el-table-column :label="$t('terminal.terminal.name')" prop="name" />
    </el-table>
    <div class="mt-[12px] flex justify-end">
      <el-pagination
        v-model:current="page.current"
        v-model:page-size="page.pageSize"
        :page-sizes="[20, 50, 100, 200]"
        :total="page.total"
        layout="total,prev, pager, next, sizes,jumper"
        @change="pageChange"
      />
    </div>
  </Modal>
</template>
