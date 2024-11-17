<script setup lang="ts">
import { useWindowSize } from '@vueuse/core';

interface TabType {
  label: string;
  value: string;
}
type Props = {
  tabs: TabType[];
};
const props = withDefaults(defineProps<Props>(), {});
const current = defineModel('current');
const handleClick = (index: number) => {
  current.value = props.tabs?.[index]?.value;
};
const { height } = useWindowSize();
</script>

<template>
  <el-tabs
    :style="{ height: `${height - 136}px` }"
    class="m-[12px] mb-[0px]"
    type="border-card"
    @tab-change="handleClick"
  >
    <el-tab-pane
      v-for="(tab, index) in props.tabs"
      :key="index"
      :label="tab.label"
      :value="tab.value"
      class="h-full"
    >
      <slot v-if="current === tab.value" name="default"></slot>
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped></style>
