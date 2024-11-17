<script setup lang="ts">
import { ref } from 'vue';

import mixDetail from '#/components/mix-detail/index.vue';

import baseInfo from './base-info.vue';
import gridList from './grid-list.vue';
import onlineList from './online-list.vue';

interface TabType {
  label: string;
  value: string;
}
const tabList = ref<TabType[]>([
  { label: '基本信息', value: 'baseinfo' },
  { label: '上线记录', value: 'online' },
  { label: '报文记录', value: 'grid' },
]);

const current = ref<string>('baseinfo');
</script>

<template>
  <mixDetail v-model:current="current" :tabs="tabList">
    <template #default>
      <baseInfo v-if="current === 'baseinfo'" />
      <onlineList v-if="current === 'online'" />
      <gridList v-if="current === 'grid'" />
    </template>
  </mixDetail>
</template>

<style scoped></style>
