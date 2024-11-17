<script lang="ts" setup>
import type { configItemType } from '../types';

import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { getTerminalItemApi } from '#/api';
import { $t } from '#/locales';

const route = useRoute();

const detailData = ref<configItemType>();
const tag = ref<string[]>();
/* 终端类型分类 */
const typeOptions = {
  'Mixlinker Aprus-M': 'Mixlinker Aprus-M',
  'Mixlinker Aprus-X': 'Mixlinker Aprus-X',
  'Mixlinker DataSimulate': $t('terminal.terminal.moni_ter'),
  Other: $t('terminal.terminal.third_party'),
  UFS: 'UFS',
};

onMounted(async () => {
  const result = await getTerminalItemApi({
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
      <el-descriptions-item :label="$t('terminal.terminal.uid')">
        {{ detailData?.uid || '' }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('terminal.terminal.name')">
        {{ detailData?.name || '' }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('terminal.terminal.alias')">
        {{ detailData?.alias || '' }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('terminal.terminal.type')">
        {{
          detailData?.type ? typeOptions[detailData.type] : typeOptions.Other
        }}
      </el-descriptions-item>
      <!-- 终端配置编号 -->
      <el-descriptions-item :label="$t('terminal.terminal.config_id')">
        {{ detailData?.config_id }}
      </el-descriptions-item>
      <!-- 生产厂家 -->
      <el-descriptions-item :label="$t('terminal.terminal.maker')">
        {{ detailData?.maker }}
      </el-descriptions-item>
      <!-- 终端状态 -->
      <el-descriptions-item :label="$t('terminal.terminal.online')">
        <a-tag :color="detailData?.online === 1 ? 'green' : 'red'">
          {{
            detailData?.online === 1
              ? $t('terminal.terminal.online_status')
              : $t('terminal.terminal.offline_status')
          }}
        </a-tag>
      </el-descriptions-item>
      <el-descriptions-item :label="$t('terminal.terminal.iccid')">
        {{
          detailData?.nominal && detailData?.nominal?.ICCID
            ? detailData?.nominal?.ICCID
            : ''
        }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('terminal.terminal.lua_version')">
        <div class="flex-between flex-wrap">
          {{
            detailData?.nominal && detailData?.nominal.LUA
              ? detailData?.nominal.LUA
              : ''
          }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item :label="$t('terminal.terminal.softinfo')">
        {{ detailData?.nominal?.MCU }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('terminal.terminal.status_4g_signal')">
        {{ detailData?.status_4g_signal || '' }}
      </el-descriptions-item>
      <!-- 最近上报时间 -->
      <el-descriptions-item :label="$t('terminal.terminal.last_online_time')">
        {{ detailData?.last_online_time }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('terminal.terminal.col_status')">
        {{ detailData?.col_status || '' }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('terminal.terminal.cup_temperature')">
        {{ detailData?.cup_temperature }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('terminal.terminal.mqtt_info_ip')">
        {{ detailData?.mqtt_info_ip }}
      </el-descriptions-item>
      <el-descriptions-item
        :label="$t('terminal.terminal.mqtt_status_connection')"
      >
        {{ detailData?.mqtt_status_connection }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('terminal.terminal.col_status_runtime')">
        {{ detailData?.col_status_runtime }}
      </el-descriptions-item>

      <!-- <el-descriptions-item :label="$t('terminal.terminal.luainfo')">{{ object.nominal?.LUA }}</el-descriptions-item> -->
      <el-descriptions-item :label="$t('terminal.terminal.status_4g')">
        {{ detailData?.status_4g }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('terminal.terminal.info_4g')">
        {{ detailData?.info_4g }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('terminal.terminal.status_wifi')">
        {{ detailData?.status_wifi }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('terminal.terminal.info_wifi')">
        {{ detailData?.info_wifi }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('terminal.terminal.status_eth')">
        {{ detailData?.status_eth }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('terminal.terminal.info_eth')">
        {{ detailData?.info_eth }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('terminal.terminal.status_eth')">
        {{ detailData?.status_eth }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('terminal.terminal.info_mqtt')">
        {{ detailData?.info_mqtt }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('terminal.terminal.sys_status')">
        {{ detailData?.sys_status }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('terminal.terminal.gps')">
        {{ detailData?.gps }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('terminal.terminal.vnp_status')">
        {{ detailData?.vnp_status }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('terminal.terminal.created')" :span="2">
        {{ detailData?.created }}
      </el-descriptions-item>
      <el-descriptions-item
        :label="$t('terminal.terminal.description')"
        :span="3"
      >
        {{ detailData?.description }}
      </el-descriptions-item>
    </el-descriptions>
    <div v-if="detailData?.addition" class="flex flex-1 flex-col overflow-auto">
      <div class="mt-[12px] pb-[12px] pt-[12px] text-[16px]">
        <div class="font-bold">{{ $t('addition.info') }}</div>
      </div>
      <div class="flex-1">
        <el-collapse class="w-full" icon="ArrowLeft">
          <el-collapse-item
            v-for="(item, index) in detailData.addition"
            :key="index"
            :name="index"
            :title="item.title"
          >
            <div class="addition-wrap flex-wrap">
              <el-space class="flex flex-wrap">
                <div
                  v-for="(sub, subindex) in item.data"
                  :key="subindex"
                  class="item mb-[4px] flex items-center"
                >
                  <div class="w-[100px] pr-[8px] text-left">{{ sub[0] }}:</div>
                  <div class="name">
                    <el-input
                      v-model="sub[1]"
                      :disabled="true"
                      :placeholder="$t('placeholder.input')"
                      :value="sub[1]"
                    />
                  </div>
                </div>
              </el-space>
            </div>
          </el-collapse-item>
        </el-collapse>
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
