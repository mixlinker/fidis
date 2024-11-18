<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage, type FormInstance, type FormRules } from 'element-plus';

import { exportTerminalGridApi } from '#/api';
import { $t } from '#/locales';

import exportList from './export-list.vue';
import recordList from './record-list.vue';

const route = useRoute();

const tab = ref('record');
type FormType = {
  file_name: string;
  range: string[];
};

/* 初始化弹窗 */
const Form = ref<FormType>({
  file_name: '',
  range: [],
});
const rules = reactive<FormRules<FormType>>({
  range: [
    {
      message: $t('formRules.time_range'),
      required: true,
      trigger: 'blur',
    },
  ],
});
const FormRef = ref<FormInstance>();
const [Modal, modalApi] = useVbenModal({
  onBeforeClose: () => {
    Form.value = {
      file_name: '',
      range: [],
    };
  },
  onConfirm: async () => {
    if (FormRef.value) {
      await FormRef.value.validate();
      const data = {
        end_time: Form.value.range[1],
        file_name: Form.value.file_name,
        start_time: Form.value.range[0],
        terminal_id: route.params.id,
      };

      const result = await exportTerminalGridApi(data);
      result && ElMessage.success($t('common.success'));
      modalApi.close();
    }
  },
});
const handleExport = () => {
  modalApi.open();
};
defineExpose({ handleExport });
</script>

<template>
  <div class="w-full">
    <div class="tab-wrap">
      <el-radio-group v-model="tab">
        <el-radio-button :label="$t('terminal.grid.record')" value="record" />
        <el-radio-button :label="$t('terminal.grid.export')" value="export" />
      </el-radio-group>
    </div>
    <recordList v-if="tab === 'record'" />
    <exportList v-if="tab === 'export'" />
  </div>
  <Modal :centered="true" :title="$t('common.export')" class="w-[600px]">
    <el-form
      ref="FormRef"
      :model="Form"
      :rules="rules"
      label-width="auto"
      status-icon
    >
      <el-form-item :label="$t('terminal.grid.file_name')">
        <el-input v-model="Form.file_name" type="text" />
      </el-form-item>
      <el-form-item
        :label="$t('terminal.grid.range')"
        has-feedback
        prop="range"
      >
        <el-date-picker
          v-model="Form.range"
          :end-placeholder="$t('terminal.grid.end_time')"
          :start-placeholder="$t('terminal.grid.start_time')"
          range-separator="-"
          type="datetimerange"
        />
      </el-form-item>
    </el-form>
  </Modal>
</template>

<style lang="scss">
.tab-wrap {
  position: absolute;
  top: 16px;
  right: 16px;
}
</style>
