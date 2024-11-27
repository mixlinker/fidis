<script lang="ts" setup>
import type {
  ComponentSize,
  FormInstance,
  FormRules,
  UploadInstance,
  UploadProps,
  UploadRawFile,
} from 'element-plus';

import { inject, reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { genFileId } from 'element-plus';

import { addMenuApi, editMenuApi } from '#/api';
import { $t } from '#/locales';

const getList = inject<() => void>('getList') as () => void;

const modalType = ref<string>('add');

/* 表单配置 */
const formSize = ref<ComponentSize>('default');
const FormRef = ref<FormInstance>();
const typeOption = [
  { label: $t('report.project.year_report'), value: 1 },
  { label: $t('report.project.month_report'), value: 2 },
  { label: $t('report.project.date_report'), value: 3 },
  { label: $t('report.project.classes_report'), value: 4 },
  { label: $t('report.project.other_report'), value: 5 },
];
const executeOption = [
  { label: $t('report.project.per_year'), value: 1 },
  { label: $t('report.project.per_month'), value: 2 },
  { label: $t('report.project.per_date'), value: 3 },
  { label: $t('report.project.per_hour'), value: 4 },
  { label: $t('report.project.time_task'), value: 5 },
];
interface RuleForm {
  file_name: string;
  plan_type: number;
  output_type: number[];
  [key: string]: any;
}
const initForm = () => {
  return {
    alias: '',
    crontab: '* * * * *',
    file_name: '',
    focus_users: [],
    id: 0,
    mapping_list: [],
    output_type: [1], // 现在默认只有excel
    plan_description: '',
    plan_name: '',
    plan_script: '',
    plan_type: 1,
    run_day: 1,
    run_hour: 0,
    run_month: 1,
    run_munit: 0,
    run_type: 4,
    tableman_script: '',
    template_file: '',
    type: 0,
    uid: '',
  };
};
const Form = ref<RuleForm>(initForm());
const rules = reactive<FormRules<RuleForm>>({
  list_order: [
    {
      message: $t('page.company.message.list_order'),
      required: true,
      trigger: 'blur',
    },
  ],
  name: [
    {
      message: $t('page.menu.message.name'),
      required: true,
      trigger: 'blur',
    },
  ],
});
/* 执行周期 */
type optionType = {
  label: string;
  value: number | string;
};
const getOption = (num: number, str: string, type: string) => {
  const array: optionType[] = [];
  for (let i = 0; i < num; i++) {
    const item = ['hour', 'minute'].includes(type) ? i : i + 1;
    array.push({
      label: item + str,
      value: item,
    });
  }
  return array;
};
const monthsOption = getOption(12, $t('common.month'), 'month');
const daysOption = getOption(31, $t('common.date'), 'day');
const hoursOption = getOption(24, $t('common.hour'), 'hour');
const minutesOption = getOption(60, $t('common.minute'), 'minute');
/* 初始化弹窗 */
const [Modal, modalApi] = useVbenModal({
  onBeforeClose: () => {
    Form.value = initForm();
  },
  onConfirm: async () => {
    if (FormRef.value) {
      await FormRef.value.validate();
      await (modalType.value === 'add'
        ? addMenuApi(Form.value)
        : editMenuApi(Form.value));

      modalApi.close();
      getList();
    }
  },
  onOpenChange: async (isOpen) => {
    if (isOpen) {
      const data = modalApi.getData<RuleForm>();
      if (data) {
        modalType.value = 'edit';
        if (!data.tag) {
          data.tag = [];
        }
        Form.value = { ...data };
        Form.value.tag = [...data.tag];
      } else {
        modalType.value = 'add';
      }
    }
  },
});

/* 上传操作 */
const upload = ref<UploadInstance>();
const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};
const handleUpload = async () => {
  // const fd = new FormData();
  // fd.append('file', item.file); // 传文件
  // fd.append('system', 'mixreport/template'); // 传文件
  // const result = await uploadFileApi(fd);
};
</script>

<template>
  <Modal
    :centered="true"
    :title="
      modalType === 'add'
        ? $t('page.menu.add-title')
        : $t('page.menu.edit-title')
    "
    class="w-[50%]"
  >
    <el-form
      ref="FormRef"
      :model="Form"
      :rules="rules"
      :size="formSize"
      label-width="auto"
      status-icon
    >
      <el-form-item :label="$t('report.project.uid')" prop="uid">
        <el-input v-model="Form.uid" :placeholder="$t('placeholder.input')" />
      </el-form-item>
      <el-form-item :label="$t('report.project.name')" prop="plan_name">
        <el-input
          v-model="Form.plan_name"
          :placeholder="$t('placeholder.input')"
        />
      </el-form-item>
      <el-form-item :label="$t('report.project.alias')" prop="alias">
        <el-input v-model="Form.alias" :placeholder="$t('placeholder.input')" />
      </el-form-item>
      <el-form-item :label="$t('report.project.report_type')">
        <el-radio-group v-model="Form.plan_type" button-style="solid">
          <el-radio v-for="(v, k) in typeOption" :key="k" :value="v.value">
            {{ v.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('report.project.run_mode')">
        <el-radio-group v-model="Form.type" button-style="solid">
          <el-radio :value="0">{{ $t('report.project.hand_run') }}</el-radio>
          <el-radio :value="1">{{ $t('report.project.auto_run') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="Form.type === 1"
        :label="$t('report.project.run_period')"
      >
        <el-select v-model="Form.run_type" class="select-item">
          <el-option
            v-for="(v, k) in executeOption"
            :key="k"
            :label="v.label"
            :value="v.value"
          />
        </el-select>
        <el-select
          v-if="[1].includes(Form.run_type)"
          v-model="Form.run_month"
          class="select-item"
        >
          <el-option
            v-for="(month, idx) in monthsOption"
            :key="idx"
            :label="month.label"
            :value="month.value"
          />
        </el-select>
        <el-select
          v-if="[1, 2].includes(Form.run_type)"
          v-model="Form.run_day"
          class="select-item"
        >
          <el-option
            v-for="(day, idx) in daysOption"
            :key="idx"
            :label="day.label"
            :value="day.value"
          />
        </el-select>
        <el-select
          v-if="[1, 2, 3].includes(Form.run_type)"
          v-model="Form.run_hour"
          class="select-item"
        >
          <el-option
            v-for="(hour, idx) in hoursOption"
            :key="idx"
            :label="hour.label"
            :value="hour.value"
          />
        </el-select>
        <el-select
          v-if="[2, 3, 4].includes(Form.run_type)"
          v-model="Form.run_munit"
          class="select-item"
        >
          <el-option
            v-for="(minute, idx) in minutesOption"
            :key="idx"
            :label="minute.label"
            :value="minute.value"
          />
        </el-select>
        <el-input
          v-if="[5].includes(Form.run_type)"
          v-model="Form.crontab"
          :placeholder="$t('placeholder.input')"
          style="width: 75%"
        />
      </el-form-item>
      <el-form-item
        :label="$t('report.project.excel_script')"
        name="template_file"
        style="display: flex"
      >
        <el-upload
          ref="upload"
          :http-request="handleUpload"
          :limit="1"
          :on-exceed="handleExceed"
        >
          <template #trigger>
            <el-button type="primary">
              {{ $t('terminal.config.upload_tips') }}
            </el-button>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item
        :label="$t('report.project.excel_script')"
        name="plan_script"
      >
        <el-input :rows="6" type="textarea" />
      </el-form-item>
      <el-form-item :label="$t('common.description')">
        <el-input :rows="4" type="textarea" />
      </el-form-item>
    </el-form>
  </Modal>
</template>
<style scoped lang="scss">
.select-item {
  width: calc(25% - 8px);
  margin-right: 8px;

  &:last-child {
    width: 25%;
    margin-right: 0;
  }
}
</style>
