<script setup lang="ts">
import type { buttonType, columnType, pageType } from './type';

import { computed, getCurrentInstance, reactive, ref } from 'vue';

import { useWindowSize } from '@vueuse/core';

import mixRightMenu from '#/components/mix-right-menu/index.vue';

interface Props {
  localButtons: buttonType[];
  tableData: any[];
  columns: columnType[];
  pager: pageType;
}
withDefaults(defineProps<Props>(), {});
const tHeight = defineModel('tHeight');
const page = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
});
const { proxy } = getCurrentInstance() as any;

const rightMenuRef = ref<any>(null);
const rowContextmenu = (row: any) => {
  rightMenuRef.value.showRightMenu(row);
};

const rightClick = (data: { row: any; type: string }) => {
  proxy.$parent.rightFunction[data.type](data.row);
};
const { height } = useWindowSize();
const TableMaxH = computed(() => {
  return height.value - 234;
});

const pageChange = (current: number, size: number) => {
  proxy.$parent.pageChange(current, size);
};
</script>

<template>
  <el-table
    :data="tableData"
    :max-height="tHeight || TableMaxH"
    :style="{ height: `${tHeight || TableMaxH}px` }"
    border
    style="width: 100%"
    @row-contextmenu="rowContextmenu"
  >
    <el-table-column
      v-for="(col, idx) in columns"
      :key="idx"
      :fit="true"
      :fixed="col.fixed || false"
      :formatter="col.formatter || null"
      :label="col.label"
      :prop="col.field"
      :show-overflow-tooltip="col.showOverflowTooltip"
      :stripe="true"
      :width="col.width || ''"
    >
      <template #default="scope">
        <template v-if="col.type === 'tag'">
          <el-tag
            v-for="(item, index) in scope.row.tag"
            :key="index"
            class="mr-1"
            type="primary"
          >
            {{ item }}
          </el-tag>
        </template>
        <template v-if="col.type === 'status'">
          <el-tag :type="col.option[scope.row[col.field]].type">
            {{ col.option[scope.row[col.field]].label }}
          </el-tag>
        </template>
      </template>
    </el-table-column>
  </el-table>
  <div class="mt-[12px] flex justify-end">
    <el-pagination
      v-model:current="page.current"
      v-model:page-size="page.pageSize"
      :page-sizes="[20, 50, 100, 200]"
      :total="pager.total"
      layout="total,prev, pager, next, sizes,jumper"
      @change="pageChange"
    />
  </div>
  <mixRightMenu
    ref="rightMenuRef"
    :local-buttons="localButtons"
    @right-click="rightClick"
  />
</template>

<style scoped></style>
