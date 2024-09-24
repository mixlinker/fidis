<script lang="ts" setup>
import type { ComponentSize, FormInstance, TableInstance } from 'element-plus';

import { reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import {
  getInDataSourceApi,
  getUserBindDataApi,
  proxyApi,
  userBindDataApi,
  userUbindDataApi,
} from '#/api';
import { $t } from '#/locales';

interface sourceMapItem {
  [key: string]: any;
}
const sourceMap: sourceMapItem = {
  calculate: {
    action: 'get_calculate_task_list',
    title: 'page.data-source.calculate',
  },
  statistics: {
    action: 'get_statistics_task_list',
    title: 'page.data-source.statistics',
  },
};

interface dataItemType {
  name: string;
  type: string;
}

const dataSourceList = ref<dataItemType[]>();
/* 表单配置 */
const formSize = ref<ComponentSize>('default');
const FormRef = ref<FormInstance>();

interface RuleForm {
  uid_list: number[];
  user_id: number;
  source_type: string | undefined;
}
const Form = ref<RuleForm>({
  source_type: '',
  uid_list: [],
  user_id: 0,
});

/* 项目数据列表 */
const rightTableRef = ref<TableInstance>();
const page = reactive({
  currentPage: 1,
  pageSize: 7,
  total: 0,
});
const dataProjectList = ref<any[]>();
interface ParamType {
  [key: string]: any; // 允许其他动态键
}
const dataProjectMap = ref<ParamType>({});
const dataSelectList = ref<any[]>([]);
const selectionChange = (selectedKeys: any[], row: any) => {
  if (selectedKeys.some((item) => item.uid === row.uid)) {
    dataSelectList.value.push(row);
  } else {
    const flagIndex = dataSelectList.value.findIndex(
      (item) => item.uid === row.uid,
    );
    dataSelectList.value.splice(flagIndex, 1);
  }
};
const selectAll = (selectedKeys: any[]) => {
  if (selectedKeys.length > 0) {
    selectedKeys.forEach((item) => {
      if (!dataSelectList.value.some((ele) => ele.uid === item.uid)) {
        dataSelectList.value.push(item);
      }
    });
  } else {
    // @ts-ignore 忽略
    dataProjectList.value.forEach((item) => {
      const flagIndex = dataSelectList.value.findIndex(
        (ele) => ele.uid === item.uid,
      );
      if (flagIndex !== -1) {
        dataSelectList.value.splice(flagIndex, 1);
      }
    });
  }
};
const toggleSelection = () => {
  // @ts-ignore 忽略
  dataProjectList.value.forEach((row) => {
    if (dataSelectList.value.some((item) => item.uid === row.uid)) {
      rightTableRef.value!.toggleRowSelection(row, true);
    }
  });
};

const getProjectData = async () => {
  if (Form.value.source_type) {
    const result = await proxyApi({
      action: sourceMap[Form?.value.source_type].action,
      page_index: page.currentPage,
      page_size: page.pageSize,
      select: ['name', 'uid'],
    });
    dataProjectList.value = result.data;
    page.total = result.total_records;
  }
};
const getProjectDataMap = async () => {
  if (Form.value.source_type) {
    // @ts-ignore 忽略
    const result = await proxyApi({
      action: sourceMap[Form?.value.source_type].action,
      select: ['name', 'uid'],
    });
    // @ts-ignore 忽略
    result.data.forEach((item) => {
      // @ts-ignore 忽略
      dataProjectMap[item.uid] = item;
    });
  }
};
const handleCurrentChange = async (val: number) => {
  page.currentPage = val;
  await getProjectData();
  toggleSelection();
};

/* 已绑定的数据 */
const historyBindData = ref<any[]>([]);
const getHistoryBindData = () => {
  getUserBindDataApi({ user_id: Form.value.user_id }).then((res) => {
    historyBindData.value = res;
    if (Form.value.source_type) {
      dataSelectList.value = historyBindData.value.filter(
        (item) => item.source_type === Form.value.source_type,
      );
      dataSelectList.value.forEach((item) => {
        // @ts-ignore 忽略
        item.name = dataProjectMap[item.uid].name;
      });
      toggleSelection();
    }
  });
};

/* 切换数据源 */
const changeSource = async () => {
  getProjectData();
  await getProjectDataMap();
  getHistoryBindData();
};
/* 初始化弹窗 */
const [Modal, modalApi] = useVbenModal({
  onBeforeClose: () => {
    Form.value.user_id = 0;
    Form.value.source_type = '';
    Form.value.uid_list = [];
    page.currentPage = 1;
    dataProjectList.value = [];
    dataSelectList.value = [];
  },
  onConfirm: async () => {
    if (FormRef.value) {
      await FormRef.value.validate();
      const addDataUidList: number[] = [];
      const deleteDataUidList: number[] = [];

      dataSelectList.value.forEach((item) => {
        if (!historyBindData.value.some((ele) => ele.uid === item.uid)) {
          addDataUidList.push(item.uid);
        }
      });

      historyBindData.value.forEach((item) => {
        if (!dataSelectList.value.some((ele) => ele.uid === item.uid)) {
          deleteDataUidList.push(item.uid);
        }
      });
      addDataUidList.length > 0 &&
        (await userBindDataApi({
          source_type: Form.value.source_type,
          uid_list: addDataUidList,
          user_id: Form.value.user_id,
        }));
      deleteDataUidList.length > 0 &&
        (await userUbindDataApi({
          source_type: Form.value.source_type,
          uid_list: deleteDataUidList,
          user_id: Form.value.user_id,
        }));

      modalApi.close();
    }
  },
  onOpenChange: async (isOpen) => {
    if (isOpen) {
      const data = modalApi.getData<any>();
      Form.value.user_id = data.id;
      const dataResult = await getInDataSourceApi();
      dataSourceList.value = dataResult;
      Form.value.source_type = dataResult[0]?.type;
      getProjectData();
      await getProjectDataMap();
      getHistoryBindData();
    }
  },
});
</script>

<template>
  <Modal :title="$t('page.user.bind-data')" class="w-[1000px]">
    <el-form
      ref="FormRef"
      :model="Form"
      :size="formSize"
      label-width="auto"
      status-icon
      style="max-width: 100%"
    >
      <el-form-item :label="$t('page.data-source.title')" prop="name">
        <el-select v-model="Form.source_type" @change="changeSource">
          <el-option
            v-for="item in dataSourceList"
            :key="item.type"
            :label="item.name"
            :value="item.type"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="
          Form?.source_type ? $t(sourceMap[Form?.source_type].title) : '项目'
        "
        prop="name"
      >
        <div class="flex w-full border border-solid border-[#d9d9d9]">
          <div class="w-[50%] p-3">
            <el-table
              ref="rightTableRef"
              :data="dataProjectList"
              border
              style="width: 100%; height: 400px"
              @select="selectionChange"
              @select-all="selectAll"
            >
              <el-table-column type="selection" />
              <el-table-column :label="$t('page.data-source.uid')" prop="uid" />
              <el-table-column
                :label="$t('page.data-source.name')"
                prop="name"
              />
            </el-table>
            <div class="mt-[12px] flex justify-end">
              <el-pagination
                v-model:current-page="page.currentPage"
                v-model:page-size="page.pageSize"
                :pager-count="5"
                :total="page.total"
                layout="total,prev, pager, next,jumper"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
          <div class="w-[50%] p-3" style="border-left: 1px solid #d9d9d9">
            <el-table
              :data="dataSelectList"
              border
              style="width: 100%; height: 400px"
            >
              <el-table-column :label="$t('page.data-source.uid')" prop="uid" />
              <el-table-column
                :label="$t('page.data-source.name')"
                prop="name"
              />
            </el-table>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </Modal>
</template>
