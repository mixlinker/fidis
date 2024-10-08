<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { proxyApi } from '#/api';

const route = useRoute();
const dashBoardUid = computed(() => {
  return route.fullPath.split('/')[3];
});

const script = ref<any>();
const engine = ref<string>();
const type = ref<any>();
onMounted(async () => {
  const result = await proxyApi({
    action: 'get_dashboard_item',
    uid: dashBoardUid.value,
  });
  script.value = result.script;
  type.value = result.type;
  engine.value = result.script?.engine || 'old';
});
</script>

<template>
  <div class="dashboard-wrap">
    <mixlinker2d
      v-if="engine === 'openboard'"
      :setting="script"
      http_proxy="/fidis"
      ws_proxy="/fidis/ws"
    />
    <mix-dashboard
      v-if="script && engine === 'old'"
      :params="{
        script,
        ws_proxy: '/fidis/ws',
        http_proxy: '/fidis',
      }"
      :type="type"
    />
  </div>
</template>

<style lang="scss" scoped>
.dashboard-wrap {
  height: 100%;
  overflow: hidden auto;
  background-color: #f7f7f7;
}
</style>
