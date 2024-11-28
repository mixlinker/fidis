<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus';

import { reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { ElButton, ElCard, ElSpace } from 'element-plus';

import { $t } from '#/locales';

const formRef = ref<FormInstance>();
const Form = reactive({
  address: '',
  id: '',
  secret: '',
});
const formRules = reactive<FormRules>({
  address: [
    {
      message: $t('system.message.mixiot_address'),
      required: true,
      trigger: 'blur',
    },
  ],
  id: [
    {
      message: $t('system.message.mixiot_id'),
      required: true,
      trigger: 'blur',
    },
  ],
  secret: [
    {
      message: $t('system.message.mixiot_secret'),
      required: true,
      trigger: 'blur',
    },
  ],
});

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(() => {});
};
</script>

<template>
  <Page :title="$t('system.mixiot.title')" description="">
    <ElCard class="mb-5" style="border-radius: 4px">
      <template #header>
        <div class="font-bold">{{ $t('system.mixiot.address') }}</div>
      </template>
      <ElSpace>
        <el-form
          ref="formRef"
          :model="Form"
          :rules="formRules"
          label-width="auto"
          status-icon
        >
          <el-form-item :label="$t('system.mixiot.address')" prop="address">
            <el-input v-model="Form.address" style="width: 600px" />
          </el-form-item>
          <el-form-item :label="$t('system.mixiot.id')" prop="id">
            <el-input v-model="Form.id" style="width: 600px" />
          </el-form-item>
          <el-form-item :label="$t('system.mixiot.secret')" prop="secret">
            <el-input v-model="Form.secret" style="width: 600px" />
          </el-form-item>
          <el-form-item>
            <ElButton
              style="border-radius: 4px"
              type="primary"
              @click="submitForm(formRef)"
            >
              {{ $t('common.submit') }}
            </ElButton>
          </el-form-item>
        </el-form>
      </ElSpace>
    </ElCard>
  </Page>
</template>
