<script lang="ts" setup>
import type { configItemType } from '../types';

import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { useClipboard } from '@vueuse/core';
import { ElMessage } from 'element-plus';

import { getTerminalConfigItemApi } from '#/api';
import { $t } from '#/locales';

const route = useRoute();

const detailData = ref<configItemType>();
const tag = ref<string[]>();

/* 下载文件 */
const downFile = (url: string | undefined) => {
  if (!url) return;
  const path = `${window.location.origin}/mixservice/storage/${url}`;
  window.open(path);
};

const formatScript = (script: string | undefined) => {
  if (!script) return;
  return JSON.stringify(JSON.parse(script), null, 4);
};

/* 扩展信息 */
const { copy } = useClipboard({ legacy: true });
const copyScript = async (script: string | undefined) => {
  if (!script) return;
  await copy(JSON.stringify(JSON.parse(script), null, 4));
  ElMessage.success($t('message.copy'));
};

onMounted(async () => {
  const result = await getTerminalConfigItemApi({
    uid: route.params.id,
  });
  detailData.value = result;
  if (detailData.value?.tag) {
    tag.value = detailData.value.tag ? JSON.parse(detailData.value.tag) : [];
  }
});
</script>

<template>
  <div class="bg-background flex h-full flex-col overflow-hidden">
    <el-descriptions :column="3" border>
      <el-descriptions-item :label="$t('terminal.config.uid')">
        {{ detailData?.uid }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('terminal.config.name')">
        {{ detailData?.name }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('terminal.config.alias')">
        {{ detailData?.alias }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('terminal.config.lua_version')">
        {{ detailData?.lua_version }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('terminal.config.lua_file')" :span="2">
        <div class="flex items-center justify-between">
          <span>{{ detailData?.lua_file }}</span>
          <el-link type="primary" @click="downFile(detailData?.lua_file)">
            <el-icon><Download /></el-icon>
          </el-link>
        </div>
      </el-descriptions-item>
      <el-descriptions-item :label="$t('common.tag')">
        <el-tag
          v-for="(item, index) in tag"
          :key="index"
          class="mr-1"
          type="primary"
        >
          {{ item }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item :label="$t('common.created_at')">
        {{ detailData?.created }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('common.updated_at')">
        {{ detailData?.last_modified }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('common.description')">
        {{ detailData?.description }}
      </el-descriptions-item>
    </el-descriptions>
    <div class="flex flex-1 flex-col overflow-hidden">
      <div
        class="mt-[12px] flex items-center justify-between pb-[12px] pt-[12px] text-[16px]"
      >
        <div class="font-bold">{{ $t('addition.info') }}</div>
        <div class="flex cursor-pointer">
          <div class="mr-[8px]">
            <el-popover placement="top-start">
              <template #reference>
                <el-icon @click="copyScript(detailData?.addition)">
                  <CopyDocument />
                </el-icon>
              </template>
              {{ $t('script.copy') }}
            </el-popover>
          </div>
          <div class="mr-[8px]">
            <el-popover placement="top-start">
              <template #reference>
                <el-icon><Crop /></el-icon>
              </template>
              {{ $t('script.view') }}
            </el-popover>
          </div>
        </div>
      </div>
      <div class="script-body flex-1">
        <pre>{{ formatScript(detailData?.addition) }}</pre>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.script-body {
  min-width: calc(100% - 22px);
  height: 100%;
  padding: 10px;
  overflow: auto;
  color: #666;
  background-color: #fafafa;
  border: 1px solid #ccc;
}
</style>
