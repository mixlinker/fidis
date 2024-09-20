<script lang="ts" setup>
import type { InputInstance } from 'element-plus';

import { nextTick, ref } from 'vue';

import { ElInput } from 'element-plus';

const inputValue = ref('');
const dynamicTags = defineModel<string[]>({ required: true });
const inputVisible = ref(false);
const InputRef = ref<InputInstance>();

const handleClose = (tag: string) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value);
  }
  inputVisible.value = false;
  inputValue.value = '';
};
</script>

<template>
  <div class="flex gap-2">
    <el-tag
      v-for="tag in dynamicTags"
      :key="tag"
      :disable-transitions="false"
      closable
      @close="handleClose(tag)"
    >
      {{ tag }}
    </el-tag>
    <ElInput
      v-if="inputVisible"
      ref="InputRef"
      v-model="inputValue"
      class="w-20"
      size="small"
      @blur="handleInputConfirm"
      @keyup.enter="handleInputConfirm"
    />
    <el-button v-else class="button-new-tag" size="small" @click="showInput">
      {{ $t('common.add-tag') }}
    </el-button>
  </div>
</template>
