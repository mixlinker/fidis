<script setup lang="ts">
import type {
  buttonType,
  columnStorageType,
  columnType,
  pageType,
} from './type';

import {
  computed,
  getCurrentInstance,
  nextTick,
  onMounted,
  reactive,
  ref,
  watchEffect,
} from 'vue';

import { vElementSize } from '@vueuse/components';
import { useDebounceFn, useWindowSize } from '@vueuse/core';

import mixRightMenu from '#/components/mix-right-menu/index.vue';

interface Props {
  localButtons: buttonType[];
  tableData: any[];
  columns: columnType[];
  pager: pageType;
  listName: string;
}
const props = withDefaults(defineProps<Props>(), {});
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

/* 修改列宽后，储存到localeStroage里面，初始化时读取 */
const currentColumns = ref<columnType[]>([]);
const setColumnsStorage = () => {
  const columnsMapping = JSON.parse(
    localStorage.getItem('columnsMapping') ?? '{}',
  );
  const newColumns = proxy.$refs[props.listName].columns.map((ele: any) => {
    return {
      field: ele.property,
      width: ele.realWidth || ele.width,
    };
  });
  columnsMapping[props.listName] = newColumns;
  localStorage.setItem('columnsMapping', JSON.stringify(columnsMapping));
};
const getColumnsStorage = () => {
  /* 获取当前表格宽度 */
  const columnsMapping = JSON.parse(
    localStorage.getItem('columnsMapping') ?? '{}',
  );
  const widthMapping: { [key: string]: number } = {};
  if (columnsMapping[props.listName]) {
    columnsMapping[props.listName]?.forEach((ele: columnStorageType) => {
      widthMapping[ele.field] = ele.width;
    });
  }
  currentColumns.value = props.columns.map((ele) => {
    return {
      ...ele,
      width: widthMapping[ele.field] ?? ele.width,
    };
  });
};
const resetColumns = () => {
  // 当设置的列宽的总和小于表格总宽度时自适应
  const tableWidth =
    document.querySelectorAll('.el-table--fit')[0]?.clientWidth ?? 0;
  const totalWidth = currentColumns.value.reduce((num, cur: any) => {
    return num + cur.width;
  }, 0);
  // 当设置的列宽的总和小于表格总宽度时自适应
  if (totalWidth < tableWidth) {
    currentColumns.value = currentColumns.value.map((ele: any) => {
      return {
        ...ele,
        width: (ele.width / totalWidth) * tableWidth,
      };
    });
  } else {
    getColumnsStorage();
  }
};
const headerDrag = () => {
  setColumnsStorage();
};

watchEffect(() => {
  getColumnsStorage();
});
const onResize = useDebounceFn(() => {
  resetColumns();
}, 50);

onMounted(() => {
  resetColumns();
  nextTick(() => {
    setColumnsStorage();
  });
});
</script>

<template>
  <div v-element-size="onResize">
    <el-table
      :ref="listName"
      :data="tableData"
      :max-height="tHeight || TableMaxH"
      :style="{ height: `${tHeight || TableMaxH}px` }"
      border
      style="width: 100%"
      @header-dragend="headerDrag"
      @row-contextmenu="rowContextmenu"
    >
      <el-table-column
        v-for="(col, idx) in currentColumns"
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
  </div>
</template>

<style scoped></style>
