<script lang="ts" setup>
import type { ComponentSize, FormInstance, FormRules } from 'element-plus';

import { inject, reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { addMenuApi, editMenuApi } from '#/api';
import mixDynamisTags from '#/components/mix-dynamic-tag/index.vue';
import { $t } from '#/locales';

const getList = inject<() => void>('getList') as () => void;

const modalType = ref<string>('add');

/* 表单配置 */
const formSize = ref<ComponentSize>('default');
const FormRef = ref<FormInstance>();

interface RuleForm {
  name: string;
  list_order: number;
  tag: string[];
  parent_id: number;
  description: string;
  url: string;
  display: number;
}
const initForm = () => {
  return {
    description: '',
    display: 1,
    list_order: 0,
    name: '',
    parent_id: 0,
    tag: [],
    url: '',
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
</script>

<template>
  <Modal
    :title="
      modalType === 'add'
        ? $t('page.menu.add-title')
        : $t('page.menu.edit-title')
    "
    class="w-[600px]"
  >
    <el-form
      ref="FormRef"
      :model="Form"
      :rules="rules"
      :size="formSize"
      label-width="auto"
      status-icon
      style="max-width: 600px"
    >
      <el-form-item :label="$t('page.menu.name')" prop="name">
        <el-input v-model="Form.name" />
      </el-form-item>
      <el-form-item :label="$t('page.menu.dashboard-uid')" prop="name">
        <el-input v-model="Form.url" />
      </el-form-item>
      <el-form-item :label="$t('common.sort')" prop="list_order">
        <el-input-number v-model="Form.list_order" />
      </el-form-item>
      <el-form-item :label="$t('common.tag')" prop="tag">
        <mixDynamisTags v-model="Form.tag" />
      </el-form-item>
      <el-form-item :label="$t('common.description')" prop="description">
        <el-input v-model="Form.description" :rows="5" type="textarea" />
      </el-form-item>
    </el-form>
  </Modal>
</template>
