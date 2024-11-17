<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus';

import type { additionType, configItemType } from '../types';

import { inject, reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import {
  addTerminalApi,
  editTerminalApi,
  getTerminalConfigListApi,
} from '#/api';
import { $t } from '#/locales';
/* 父组件刷新列表 */
const getList = inject<() => void>('getList') as () => void;

const modalType = ref<string>('add');
/* 配置列表 */

type configType = configItemType[];
const configList = ref<configType>([]);

/* 表单配置 */
const FormRef = ref<FormInstance>();
/* 公共 */
interface terminalType {
  label: string;
  value: string;
}
const typeList: terminalType[] = [
  { label: 'Mixlinker Aprus-M', value: 'Mixlinker Aprus-M' },
  { label: 'Mixlinker Aprus-X', value: 'Mixlinker Aprus-X' },
  { label: $t('terminal.terminal.third_party'), value: 'Other' },
  {
    label: $t('terminal.terminal.moni_ter'),
    value: 'Mixlinker DataSimulate',
  },
  { label: 'UFS', value: 'UFS' },
];
interface RuleForm {
  name: string;
  uid: string;
  alias: string;
  type: string;
  config_id: string;
  marker: string;
  tag: string[];
  [key: string]: any;
}
const Form = ref<RuleForm>({
  alias: '',
  config_id: '',
  description: '',
  marker: '',
  name: '',
  tag: [],
  type: 'Mixlinker Aprus-X',
  uid: '',
});
const rules = reactive<FormRules<RuleForm>>({
  name: [
    {
      message: $t('page.company.message.name'),
      required: true,
      trigger: 'blur',
    },
  ],
});

/* 初始化弹窗 */
const addition = ref<additionType>([]);
const [Modal, modalApi] = useVbenModal({
  onBeforeClose: () => {
    Form.value = {
      alias: '',
      config_id: '',
      description: '',
      marker: '',
      name: '',
      tag: [],
      type: 'Mixlinker Aprus-X',
      uid: '',
    };
  },
  onConfirm: async () => {
    if (FormRef.value) {
      await FormRef.value.validate();
      await (modalType.value === 'add'
        ? addTerminalApi(Form.value)
        : editTerminalApi(Form.value));
      getList();
      modalApi.close();
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
        if (Form.value.addition) {
          addition.value = [...Form.value.addition];
        }
      } else {
        modalType.value = 'add';
      }
      const result = await getTerminalConfigListApi({
        page_index: 1,
        page_size: 999,
      });
      configList.value = result.data;
    }
  },
});

const changeConfig = (value: string) => {
  let selectConfig: configItemType = {
    name: '',
    uid: '',
  };
  configList.value.forEach((item: configItemType) => {
    if (item.uid === value) {
      selectConfig = item;
    }
  });
  addition.value = selectConfig.addition
    ? JSON.parse(selectConfig.addition)
    : [];
};
</script>

<template>
  <Modal
    :centered="true"
    :title="
      modalType === 'add'
        ? $t('terminal.terminal.add_title')
        : $t('terminal.terminal.edit_title')
    "
    class="w-[50%]"
  >
    <el-form ref="FormRef" :model="Form" :rules="rules" label-width="auto">
      <el-row :gutter="12">
        <el-col v-if="modalType === 'edit'" :span="8">
          <el-form-item
            :label="$t('terminal.terminal.uid')"
            has-feedback
            prop="uid"
          >
            <el-input
              :disabled="modalType === 'edit'"
              type="text"
              v-model.trim="Form.uid"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="$t('terminal.terminal.name')"
            has-feedback
            prop="name"
          >
            <el-input v-model="Form.name" type="text" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="$t('terminal.terminal.alias')"
            has-feedback
            prop="alias"
          >
            <el-input v-model="Form.alias" type="text" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="8">
          <el-form-item
            :label="$t('terminal.terminal.type')"
            class="flex"
            has-feedback
            prop="type"
          >
            <el-select
              v-model="Form.type"
              :placeholder="$t('placeholder.select')"
              option-filter-prop="label"
              show-search
            >
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                {{ item.label }}
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="$t('terminal.terminal.config')"
            prop="config_id"
          >
            <el-select
              v-model="Form.config_id"
              :placeholder="$t('placeholder.select')"
              option-filter-prop="label"
              show-search
              @change="changeConfig"
            >
              <el-option
                v-for="item in configList"
                :key="item.uid"
                :label="item.name"
                :value="item.uid"
              >
                {{ item.name }}
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('terminal.terminal.maker')" prop="maker">
            <el-input v-model="Form.maker" type="text" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        v-if="addition && addition.length > 0"
        :label="$t('terminal.config.addition')"
      >
        <el-collapse class="w-full" icon="ArrowLeft">
          <el-collapse-item
            v-for="(item, index) in addition"
            :key="index"
            :name="index"
            :title="item.title"
          >
            <div class="addition-wrap flex-wrap">
              <el-space class="flex flex-wrap">
                <div
                  v-for="(sub, subindex) in item.data"
                  :key="subindex"
                  class="item mb-[4px] flex items-center"
                >
                  <div class="w-[100px] pr-[8px] text-left">{{ sub[0] }}:</div>
                  <div class="name">
                    <el-input
                      v-model="sub[1]"
                      :placeholder="$t('placeholder.input')"
                      :value="sub[1]"
                      class="mix-input"
                    />
                  </div>
                </div>
              </el-space>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-form-item>
      <el-form-item
        :label="$t('terminal.terminal.description')"
        prop="description"
      >
        <el-input v-model="Form.description" :rows="4" type="textarea" />
      </el-form-item>
    </el-form>
  </Modal>
</template>
