<script setup lang="ts">
import { ref } from 'vue';

import mixDetail from '#/components/mix-detail/index.vue';

import baseInfo from './base-info.vue';
import terminalList from './terminal-list.vue';

interface TabType {
  label: string;
  value: string;
}
const tabList = ref<TabType[]>([
  { label: '基本信息', value: 'baseinfo' },
  { label: '关联终端', value: 'terminal' },
]);

const current = ref<string>('baseinfo');
</script>

<template>
  <mixDetail v-model:current="current" :tabs="tabList">
    <template #default>
      <baseInfo v-if="current === 'baseinfo'" />
      <terminalList v-if="current === 'terminal'" />
    </template>
  </mixDetail>
</template>

<style scoped></style>
