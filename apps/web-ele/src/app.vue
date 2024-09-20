<script lang="ts" setup>
import { onMounted } from 'vue';

import { useElementPlusDesignTokens } from '@vben/hooks';

import { ElConfigProvider } from 'element-plus';

import { elementLocale } from '#/locales';

defineOptions({ name: 'App' });

useElementPlusDesignTokens();

onMounted(() => {
  window.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });
});
</script>

<template>
  <ElConfigProvider :locale="elementLocale">
    <RouterView />
  </ElConfigProvider>
</template>
