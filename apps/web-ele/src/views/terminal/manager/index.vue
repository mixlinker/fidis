<script setup lang="ts">
import { onMounted, provide, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage, ElMessageBox } from 'element-plus';

import {
  commandTerminalApi,
  delTerminalApi,
  downloadTerminalApi,
  getTerminalListApi,
  refreshTerminalApi,
} from '#/api';
import mixTableList from '#/components/mix-table-list/index.vue';
import mixTopOperation from '#/components/mix-top-operation/index.vue';
import { $t } from '#/locales';
import { createRouterGuard } from '#/router/guard';

import editModal from './modal.vue';

const router = useRouter();

const tableData = ref<any[]>([]);

const searchOption = reactive({
  fieldKey: 'name',
  option: [
    { label: $t('terminal.terminal.name'), value: 'name' },
    { label: $t('terminal.terminal.uid'), value: 'uid' },
    { label: $t('terminal.terminal.alias'), value: 'alias' },
    { label: $t('terminal.terminal.maker'), value: 'maker' },
    { label: $t('common.tag'), value: 'tag' },
  ],
  searchValue: '',
});

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
  };
  if (searchOption.searchValue) {
    param.where_and = [
      [searchOption.fieldKey, 'like', `%${searchOption.searchValue}%`],
    ];
  }
  const result = await getTerminalListApi(param);
  tableData.value = result.data;
  page.total = result.total_records;
};

const pageChange = (current: number, size: number) => {
  page.current = current;
  page.pageSize = size;
  getList();
};
/* 添加和编辑弹窗初始化*/
const [Modal, modalApi] = useVbenModal({
  connectedComponent: editModal,
});
const columns = ref([
  {
    field: 'uid',
    label: $t('terminal.terminal.uid'),
    width: 160,
  },
  {
    field: 'name',
    label: $t('terminal.terminal.name'),
    width: 160,
  },
  {
    field: 'alias',
    label: $t('terminal.terminal.alias'),
    width: 160,
  },
  {
    field: 'type',
    label: $t('terminal.terminal.type'),
    width: 160,
  },
  {
    field: 'config_id',
    label: $t('terminal.terminal.config_id'),
    width: 160,
  },
  {
    field: 'online',
    label: $t('terminal.terminal.online'),
    option: {
      0: { label: $t('terminal.terminal.offline_status'), type: 'danger' },
      1: { label: $t('terminal.terminal.online_status'), type: 'primary' },
    },
    type: 'status',
    width: 100,
  },
  {
    field: 'csq',
    label: $t('terminal.terminal.csq'),
    width: 160,
  },
  {
    field: 'last_online_time',
    label: $t('terminal.terminal.last_online_time'),
    width: 160,
  },
  {
    field: 'nominal.ICCID',
    label: $t('terminal.terminal.iccid'),
    width: 160,
  },
  {
    field: 'maker',
    label: $t('terminal.terminal.maker'),
    width: 160,
  },
  {
    field: 'description',
    label: $t('common.description'),
    width: 240,
  },
  {
    field: 'created',
    fixed: 'right',
    label: $t('terminal.terminal.created'),
    width: 160,
  },
]);
/* 添加 */
const createModal = () => {
  modalApi.setData('');
  modalApi.open();
};

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
    icon: 'Upload',
    name: $t('common.upgrade'),
    type: 'upgrade',
  },
  {
    icon: 'Download',
    name: $t('common.download'),
    type: 'download',
  },
  {
    icon: 'Refresh',
    name: $t('common.refresh'),
    type: 'refresh',
  },
  {
    icon: 'VideoPlay',
    name: $t('common.reload'),
    type: 'reload',
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
      await delTerminalApi({ uid: row.uid });
      ElMessage.success($t('message.delete_success'));
      getList();
    });
  },
  download: async (row: any) => {
    const result = await downloadTerminalApi({ terminal_id: row.uid });
    result && ElMessage.success($t('common.download') + $t('common.success'));
  },
  item: (row: any) => {
    router.push(`/terminalDetail/${row.uid}`);
  },
  refresh: async (row: any) => {
    const result = await refreshTerminalApi({ terminal_id: row.uid });
    result && ElMessage.success($t('common.refresh') + $t('common.success'));
  },
  reload: async (row: any) => {
    const result = await commandTerminalApi({
      command: 'Reboot',
      terminal_id: row.uid,
    });
    result && ElMessage.success($t('common.reload') + $t('common.success'));
  },
  update: async (row: any) => {
    modalApi.setData(row);
    modalApi.open();
  },
  upgrade: async (row: any) => {
    const command =
      row.uid.indexOf('AX') === 0 || row.type === 'Mixlinker Aprus-X'
        ? 'AXUpgrade'
        : 'Upgrade';
    const result = await commandTerminalApi({
      command,
      terminal_id: row.uid,
      value: 'LUA',
    });
    result && ElMessage.success($t('common.upgrade') + $t('common.success'));
  },
};

const search = () => {
  page.current = 1;
  getList();
};

const commands = ref([
  {
    type: 'create',
  },
]);

onMounted(() => {
  getList();
  router.addRoute('UserCenter', {
    component: () => import('#/views/usercenter/company/index.vue'),
    meta: {
      affixTab: false,
      icon: 'lucide:area-chart',
      title: '测试',
    },
    name: 'About',
    path: '/about',
  });
  // 创建路由守卫
  createRouterGuard(router);
});

provide('getList', getList);
defineExpose({ createModal, pageChange, rightFunction, search });
</script>

<template>
  <div class="p-3">
    <mixTopOperation :command="commands" :search-option="searchOption" />
    <mixTableList
      :columns="columns"
      :local-buttons="rightButton"
      :pager="page"
      :table-data="tableData"
    />
    <Modal />
  </div>
</template>
