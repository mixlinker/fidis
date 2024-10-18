<script setup lang="ts">
import { computed, reactive, ref } from 'vue';

import { $t } from '@vben/locales';
import { useVbenForm, z } from '@vben-core/form-ui';
import { useVbenModal } from '@vben-core/popup-ui';
import { VbenAvatar, VbenButton } from '@vben-core/shadcn-ui';

import {
  getAuthConfig,
  setAuthConfig,
} from '../../../../../../apps/web-ele/src/api/core/auth';

interface Props {
  avatar?: string;
  text?: string;
}

defineOptions({
  name: 'ApiProxySetModal',
});

withDefaults(defineProps<Props>(), {
  avatar: '',
  text: '',
});

const [Form, { resetForm, setFieldValue, validate }] = useVbenForm(
  reactive({
    commonConfig: {
      hideLabel: true,
      hideRequiredMark: true,
    },
    schema: computed(() => [
      {
        component: 'VbenInput' as const,
        componentProps: {
          placeholder: $t('widgets.apiproxy.appid-placeholder'),
        },
        fieldName: 'app_id',
        formFieldProps: { validateOnBlur: false },
        rules: z
          .string()
          .min(1, { message: $t('widgets.apiproxy.appid-placeholder') }),
      },
      {
        component: 'VbenInput' as const,
        componentProps: {
          placeholder: $t('widgets.apiproxy.appsecret-placeholder'),
        },
        fieldName: 'app_secret',
        formFieldProps: { validateOnBlur: false },
        rules: z
          .string()
          .min(1, { message: $t('widgets.apiproxy.appsecret-placeholder') }),
      },
    ]),
    showDefaultActions: false,
  }),
);

const app_config_id = ref<number>(0);
const [Modal, ModalApi] = useVbenModal({
  onConfirm() {
    handleSubmit();
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      resetForm();
      getAuthConfig().then((res) => {
        app_config_id.value = res.id;
        setFieldValue('app_id', res.app_id);
        setFieldValue('app_secret', res.app_secret);
      });
    }
  },
});

async function handleSubmit() {
  const { valid, values } = await validate();
  if (valid) {
    setAuthConfig({
      app_id: values?.app_id,
      app_secret: values?.app_secret,
      id: app_config_id.value,
    }).then(() => {
      ModalApi.close();
    });
  }
}
</script>

<template>
  <Modal
    :footer="false"
    :fullscreen-button="false"
    :title="$t('widgets.apiproxy.title')"
  >
    <div
      class="mb-10 flex w-full flex-col items-center px-10"
      @keydown.enter.prevent="handleSubmit"
    >
      <div class="w-full">
        <div class="ml-2 flex w-full flex-col items-center">
          <VbenAvatar
            :src="avatar"
            class="size-20"
            dot-class="bottom-0 right-1 border-2 size-4 bg-green-500"
          />
          <div class="text-foreground my-6 flex items-center font-medium">
            {{ text }}
          </div>
        </div>
        <Form />
        <VbenButton class="mt-1 w-full" @click="handleSubmit">
          {{ $t('widgets.apiproxy.sumit') }}
        </VbenButton>
      </div>
    </div>
  </Modal>
</template>
