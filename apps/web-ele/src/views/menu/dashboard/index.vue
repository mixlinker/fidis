<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { proxyApi } from '#/api';

const route = useRoute();
const dashBoardUid = computed(() => {
  return route.fullPath.split('/')[3];
});

onMounted(() => {
  proxyApi({
    action: 'get_dashboard_item',
    uid: dashBoardUid.value,
  });
});
</script>

<template>
  <div></div>
</template>
