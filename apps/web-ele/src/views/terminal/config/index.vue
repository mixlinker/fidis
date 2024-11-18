<script setup lang="ts">
import { onMounted, provide, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage, ElMessageBox } from 'element-plus';

import { delTerminalConfigApi, getTerminalConfigListApi } from '#/api';
import mixTableList from '#/components/mix-table-list/index.vue';
import mixTopOperation from '#/components/mix-top-operation/index.vue';
import { $t } from '#/locales';
import config from '#/utils/config';

import batchModal from './batch-modal.vue';
import editModal from './modal.vue';

const router = useRouter();

const tableData = ref<any[]>([]);

const searchOption = reactive({
  fieldKey: 'name',
  option: [
    { label: $t('terminal.config.name'), value: 'name' },
    { label: $t('terminal.config.uid'), value: 'uid' },
    { label: $t('terminal.config.alias'), value: 'alias' },
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
  const result = await getTerminalConfigListApi(param);
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
    label: $t('terminal.config.uid'),
    width: 160,
  },
  {
    field: 'name',
    label: $t('terminal.config.name'),
    width: 160,
  },
  {
    field: 'alias',
    label: $t('terminal.config.alias'),
    width: 160,
  },
  {
    field: 'lua_version',
    label: $t('terminal.config.lua_version'),
    width: 160,
  },
  {
    field: 'tag',
    label: $t('common.tag'),
    type: 'tag',
    width: 160,
  },
  {
    field: 'description',
    label: $t('common.description'),
  },
  {
    field: 'last_modified',
    label: $t('terminal.config.last_modified'),
    width: 160,
  },
  {
    field: 'created',
    fixed: 'right',
    label: $t('terminal.config.created'),
    width: 160,
  },
]);
/* 添加 */
const createModal = () => {
  modalApi.setData('');
  modalApi.open();
};

const commands = ref([
  {
    type: 'create',
  },
]);

/* 右键菜单 */
const batchRef = ref<any>();
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
  {
    icon: 'SetUp',
    name: $t('common.batch_upgrade'),
    type: 'batch_upgrade',
  },
  {
    icon: 'Download',
    name: $t('common.download'),
    type: 'download',
  },
]);

const rightFunction = {
  batch_upgrade: (row: any) => {
    batchRef.value.modal.config_id = row.uid;
    batchRef.value.modalApi.open();
  },
  delete: (row: any) => {
    ElMessageBox.confirm($t('message.delete'), {
      type: 'warning',
    }).then(async () => {
      await delTerminalConfigApi({ uid: row.uid });
      ElMessage.success({
        duration: 1500,
        message: $t('message.delete_success'),
      });
      getList();
    });
  },
  download: async (row: any) => {
    if (row.lua_file) {
      const eleLink: HTMLAnchorElement = document.createElement('a');
      eleLink.style.display = 'none';
      eleLink.href = config.file_url + row.lua_file;
      document.body.append(eleLink);
      eleLink.click();
      eleLink.remove();
    } else {
      ElMessage.info('不存在lua文件');
    }
  },
  item: (row: any) => {
    router.push(`/terminalConfigDetail/${row.uid}`);
  },
  update: async (row: any) => {
    modalApi.setData(row);
    modalApi.open();
  },
};

const search = () => {
  page.current = 1;
  getList();
};

onMounted(() => {
  getList();
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
    <batchModal ref="batchRef" />
  </div>
</template>
