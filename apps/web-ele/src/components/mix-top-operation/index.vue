<script setup lang="ts">
import { computed, getCurrentInstance, toRefs } from 'vue';

import { FolderOpened, Plus, Search } from '@element-plus/icons-vue';

type optionType = {
  fieldKey: string;
  option: { [key: string]: any; label: string; value: string }[];
  searchValue: string;
};
interface Props {
  searchOption: optionType;
}
const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits(['search']);
const commands = defineModel<{ type: string }[]>('command');

const { proxy } = getCurrentInstance() as any;
type btnType = {
  [key: string]: any;
};
const buttons: btnType = {
  create: {
    func: 'createModal',
    icon: Plus,
    label: 'add',
  },
  export: {
    func: 'handleExport',
    icon: FolderOpened,
    label: 'export',
  },
};
const { fieldKey, searchValue } = toRefs(props.searchOption);

const valueType = computed(() => {
  return (
    props?.searchOption?.option?.find((el) => el.value === fieldKey.value)
      ?.type ?? 'input'
  );
});

const valueOption = computed(() => {
  return valueType.value === 'select'
    ? props?.searchOption?.option?.find((el) => el.value === fieldKey.value)
        ?.option
    : [];
});

const search = () => {
  emit('search');
};

const handleFunc = (type: string) => {
  proxy.$parent[buttons[type].func]();
};
</script>

<template>
  <div class="mb-3">
    <el-select v-model="fieldKey" class="mr-[12px]" style="width: 120px">
      <el-option
        v-for="item in searchOption.option"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select
      v-if="valueType === 'select'"
      v-model="searchValue"
      class="mr-[12px]"
      style="width: 240px"
    >
      <el-option
        v-for="item in valueOption"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-input
      v-else
      v-model="searchValue"
      :placeholder="$t('common.pleaseEnter')"
      class="mr-[12px]"
      clearable
      style="width: 240px"
      @keyup.enter="search"
    />
    <el-button :icon="Search" @click="search">
      {{ $t('common.search') }}
    </el-button>

    <el-button
      v-for="(btn, index) in commands"
      :key="index"
      :icon="buttons[btn.type].icon"
      type="primary"
      @click="handleFunc(btn.type)"
    >
      {{ $t(`common.${buttons[btn.type].label}`) }}
    </el-button>
  </div>
</template>

<style scoped></style>
