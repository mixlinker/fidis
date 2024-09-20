<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue';

import { useEventListener, useMouse } from '@vueuse/core';

type buttonType = {
  icon: string;
  name: string;
  type: string;
};
interface Props {
  localButtons: buttonType[];
}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(['rightClick']);

const record = ref({});
const rightMenu = reactive({
  left: 0,
  top: 0,
  visible: false,
});
const showPupup = computed(() => {
  return props.localButtons.length > 0;
});
// 显示右键菜单，定位到坐标x,y
const { x, y } = useMouse();
const showRightMenu = (data: any, top = 0, marginLeft = 0) => {
  if (!showPupup.value) return;
  rightMenu.visible = true;
  nextTick(() => {
    rightMenu.left = x.value + marginLeft;
    rightMenu.top = y.value + top;
    record.value = { ...data };
  });
};
useEventListener(document.body, 'click', () => {
  rightMenu.visible = false;
});

const operationClick = (type: string) => {
  emit('rightClick', {
    row: record.value,
    type,
  });
};

defineExpose({ showRightMenu });
</script>

<template>
  <div v-if="showPupup">
    <ul
      v-show="rightMenu.visible"
      :style="{ left: `${rightMenu.left}px`, top: `${rightMenu.top}px` }"
      class="contextmenu"
    >
      <li
        v-for="(item, index) in localButtons"
        :key="index"
        @click="operationClick(item.type)"
      >
        <el-icon :size="18" class="mr-2">
          <component :is="item.icon" />
        </el-icon>
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.contextmenu {
  position: fixed;
  z-index: 3000;
  min-width: 92px;
  padding: 5px 0;
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  color: #262626;
  list-style-type: none;
  background: #fff;
  border-radius: 4px;
  box-shadow: 2px 2px 3px 0 rgb(0 0 0 / 30%);

  li {
    display: flex;
    align-items: center;
    height: 32px;
    padding: 0 16px;
    line-height: 32px;
    cursor: pointer;

    &.disable {
      color: #aaa;
      cursor: not-allowed;
    }

    &:hover {
      background: #eee;
    }

    .anticon,
    .iconfont {
      margin-right: 8px;
    }
  }
}
</style>
