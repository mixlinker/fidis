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

<style>
body {
  color: unset !important;
}

h1,
h2,
h3,
h4,
h5 {
  color: unset !important;
}
</style>
