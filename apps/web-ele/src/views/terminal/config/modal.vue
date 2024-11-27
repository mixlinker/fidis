<script lang="ts" setup>
import type { ComponentSize, FormInstance, FormRules } from 'element-plus';

import { inject, reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import {
  addTerminalConfigApi,
  editTerminalConfigApi,
  getTerminalConfigItemApi,
} from '#/api';
import mixAceEditor from '#/components/mix-ace-editor/index.vue';
import mixDynamisTags from '#/components/mix-dynamic-tag/index.vue';
import { $t } from '#/locales';

const getList = inject<() => void>('getList') as () => void;

const modalType = ref<string>('add');

/* 表单配置 */
const formSize = ref<ComponentSize>('default');
const FormRef = ref<FormInstance>();

interface RuleForm {
  name: string;
  uid: string;
  alias: string;
  [key: string]: any;
}
const Form = ref<RuleForm>({
  alias: '',
  name: '',
  uid: '',
});
const rules = reactive<FormRules<RuleForm>>({
  name: [
    {
      message: $t('terminal.config.please_enter_name'),
      required: true,
      trigger: 'blur',
    },
  ],
});

/* 初始化弹窗 */
const [Modal, modalApi] = useVbenModal({
  onBeforeClose: () => {
    Form.value = {
      alias: '',
      name: '',
      tag: [],
      uid: '',
    };
  },
  onConfirm: async () => {
    if (FormRef.value) {
      await FormRef.value.validate();
      await (modalType.value === 'add'
        ? addTerminalConfigApi(Form.value)
        : editTerminalConfigApi(Form.value));

      modalApi.close();
      getList();
    }
  },
  onOpenChange: async (isOpen) => {
    if (isOpen) {
      const data = modalApi.getData<RuleForm>();
      if (data) {
        modalType.value = 'edit';
        const newData = await getTerminalConfigItemApi({ uid: data.uid });
        if (!data.tag) {
          data.tag = [];
        }
        Form.value = { ...newData };
        Form.value.tag = [...data.tag];
        if (Form.value.addition) {
          Form.value.addition = JSON.stringify(
            JSON.parse(Form.value.addition),
            null,
            2,
          );
        }
      } else {
        modalType.value = 'add';
      }
    }
  },
});
</script>

<template>
  <Modal
    :centered="true"
    :title="
      modalType === 'add'
        ? $t('terminal.config.add_title')
        : $t('terminal.config.edit_title')
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
      <el-row :gutter="12">
        <el-col v-if="modalType === 'edit'" :span="8">
          <el-form-item
            :label="$t('terminal.config.uid')"
            has-feedback
            name="uid"
          >
            <el-input
              v-model="Form.uid"
              :disabled="modalType === 'edit'"
              type="text"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="$t('terminal.config.name')"
            has-feedback
            prop="name"
          >
            <el-input v-model="Form.name" type="text" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('terminal.config.alias')" has-feedback>
            <el-input v-model="Form.alias" type="text" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="$t('common.tag')" prop="tag">
        <mixDynamisTags v-model="Form.tag" />
      </el-form-item>
      <el-form-item
        :label="$t('terminal.config.terminal_script')"
        prop="terminal_script"
      >
        <!-- <el-input v-model="Form.terminal_script" :rows="6" type="textarea" /> -->
        <mixAceEditor v-model:script="Form.terminal_script" mode="lua" />
      </el-form-item>
      <el-form-item
        :label="$t('terminal.config.config_script')"
        prop="config_script"
      >
        <!-- <el-input v-model="Form.config_script" :rows="4" type="textarea" /> -->
        <mixAceEditor v-model:script="Form.config_script" mode="lua" />
      </el-form-item>
      <el-form-item :label="$t('addition.info')" prop="addition">
        <!-- <el-input v-model="Form.addition" :rows="4" type="textarea" /> -->
        <mixAceEditor v-model:script="Form.addition" />
      </el-form-item>
      <el-form-item :label="$t('common.description')" prop="description">
        <el-input v-model="Form.description" :rows="4" type="textarea" />
      </el-form-item>
    </el-form>
  </Modal>
</template>
