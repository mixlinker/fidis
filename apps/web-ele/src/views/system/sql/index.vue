<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus';

import { onMounted, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { ElButton, ElCard, ElMessage, ElSpace } from 'element-plus';

import {
  getSqlAddressApi,
  getSqlTableConfigApi,
  resetSqlConnectApi,
  setSqlAddressApi,
  setSqlTableConfigApi,
} from '#/api';
import { $t } from '#/locales';

const addressRef = ref<FormInstance>();
const addressForm = reactive({
  address: '',
});
const addressRules = reactive<FormRules>({
  address: [
    {
      message: $t('system.message.sql_address'),
      required: true,
      trigger: 'blur',
    },
  ],
});

const writeRef = ref<FormInstance>();
const writeForm = reactive<{ [key: string]: boolean }>({
  adaps: false,
  collect: false,
  index: false,
  retainer: false,
  statistics: false,
});
const submitAddress = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      const param = {
        ip: addressForm.address,
      };
      const result = await setSqlAddressApi(param);
      await getSqlAddressApi({});
      result && ElMessage.success($t('system.message.success'));
    }
  });
};
const submitConfig = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      const param = {
        config: { ...writeForm },
      };
      const result = await setSqlTableConfigApi(param);
      await getSqlTableConfigApi({});
      result && ElMessage.success($t('system.message.success'));
    }
  });
};

const resetConnection = async () => {
  const result = await resetSqlConnectApi({});
  result && ElMessage.success($t('system.message.success'));
};

const initAddress = async () => {
  const result = await getSqlAddressApi({});
  addressForm.address = result;
};
const initConifg = async () => {
  const { config } = await getSqlTableConfigApi({});
  writeForm.adaps = config.adaps;
  writeForm.collect = config.collect;
  writeForm.index = config.index;
  writeForm.retainer = config.retainer;
  writeForm.statistics = config.statistics;
};

onMounted(() => {
  initAddress();
  initConifg();
});
</script>

<template>
  <Page :title="$t('system.sql.title')" description="">
    <ElCard class="mb-5" style="border-radius: 4px">
      <template #header>
        <div class="font-bold">{{ $t('system.sql.address') }}</div>
      </template>
      <ElSpace>
        <el-form
          ref="addressRef"
          :model="addressForm"
          :rules="addressRules"
          label-width="auto"
          status-icon
        >
          <el-form-item :label="$t('system.sql.address')" prop="address">
            <el-input v-model="addressForm.address" style="width: 600px" />
          </el-form-item>
          <el-form-item>
            <ElButton
              style="border-radius: 4px"
              type="primary"
              @click="submitAddress(addressRef)"
            >
              {{ $t('common.submit') }}
            </ElButton>
          </el-form-item>
        </el-form>
      </ElSpace>
    </ElCard>
    <ElCard class="mb-5" style="border-radius: 4px">
      <template #header>
        <div class="font-bold">{{ $t('system.sql.write') }}</div>
      </template>
      <ElSpace>
        <el-form
          ref="writeRef"
          :model="writeForm"
          label-width="auto"
          status-icon
        >
          <el-form-item
            v-for="(v, k) in writeForm"
            :key="k"
            :label="$t(`system.sql.${k}`)"
            :prop="k"
          >
            <el-radio-group v-model="writeForm[k]">
              <el-radio :value="true">
                {{ $t('common.yes') }}
              </el-radio>
              <el-radio :value="false">
                {{ $t('common.no') }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <ElButton
              style="border-radius: 4px"
              type="primary"
              @click="submitConfig(writeRef)"
            >
              {{ $t('common.submit') }}
            </ElButton>
          </el-form-item>
        </el-form>
      </ElSpace>
    </ElCard>
    <ElCard class="mb-5" style="border-radius: 4px">
      <template #header>
        <div class="font-bold">{{ $t('system.sql.reset') }}</div>
      </template>
      <ElSpace>
        <el-form-item>
          <ElButton
            style="border-radius: 4px"
            type="primary"
            @click="resetConnection"
          >
            {{ $t('system.sql.reset_tip') }}
          </ElButton>
        </el-form-item>
      </ElSpace>
    </ElCard>
  </Page>
</template>
