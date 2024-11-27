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

const record: { [key: string]: any } = ref({});
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

const getDisplay = (item: buttonType) => {
  let result = true;
  if (
    ['handle_stop', 'stop'].includes(item.type) &&
    record.value?.is_active === 0
  ) {
    result = false;
  }
  if (
    ['handle_start', 'start'].includes(item.type) &&
    record.value?.is_active === 1
  ) {
    result = false;
  }
  return result;
};

defineExpose({ showRightMenu });
</script>

<template>
  <div v-if="showPupup">
    <ul
      v-show="rightMenu.visible"
      :style="{ left: `${rightMenu.left}px`, top: `${rightMenu.top}px` }"
      class="contextmenu bg-background text-foreground"
    >
      <template v-for="(item, index) in localButtons" :key="index">
        <li v-if="getDisplay(item)" @click="operationClick(item.type)">
          <el-icon :size="18" class="mr-2">
            <component :is="item.icon" />
          </el-icon>
          {{ item.name }}
        </li>
      </template>
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
  list-style-type: none;
  border-radius: 4px;
  box-shadow: 0 2px 15px 0 rgb(0 0 0 / 30%);

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
      background: hsl(var(--accent-hover));
    }

    .anticon,
    .iconfont {
      margin-right: 8px;
    }
  }
}
</style>
