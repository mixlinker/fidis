<script setup lang="ts">
// ace-editor配置end
import { ref } from 'vue';

// ace-editor初始化配置start
import * as ace from 'ace-builds';
import searchUrl from 'ace-builds/src-noconflict/ext-searchbox?url';
import modeJsonUrl from 'ace-builds/src-noconflict/mode-json?url';
import modeLuaUrl from 'ace-builds/src-noconflict/mode-lua?url';
import themeChromeUrl from 'ace-builds/src-noconflict/theme-chrome?url';
import workerJsonUrl from 'ace-builds/src-noconflict/worker-json?url';
import workerLuaUrl from 'ace-builds/src-noconflict/worker-lua?url';
import { VAceEditor } from 'vue3-ace-editor';

defineProps({
  modalHeight: {
    default: 240,
    type: Number,
  },
  mode: {
    default: 'json',
    type: String,
  },
  parentNode: {
    default: 'mix-edit-page',
    type: String,
  },
});
ace.config.setModuleUrl('ace/mode/json', modeJsonUrl);
ace.config.setModuleUrl('ace/theme/chrome', themeChromeUrl);
ace.config.setModuleUrl('ace/ext/searchbox', searchUrl);
ace.config.setModuleUrl('ace/mode/json_worker', workerJsonUrl);

ace.config.setModuleUrl('ace/mode/lua', modeLuaUrl);
ace.config.setModuleUrl('ace/theme/chrome', themeChromeUrl);
ace.config.setModuleUrl('ace/ext/searchbox', searchUrl);
ace.config.setModuleUrl('ace/mode/lua_worker', workerLuaUrl);

const ace_editor = ref();
const editorInit = () => {
  // ace.edit('editor');
};

const currentScript = defineModel<string>('script', { required: true });
const editorOptions = ref({
  // 设置代码编辑器的样式
  fontSize: 14,
  showPrintMargin: false, // 去除编辑器里的竖线
  useWorker: true, // 开启语法检查
});
</script>

<template>
  <div class="editor-wrap">
    <VAceEditor
      id="ace-editor"
      ref="ace_editor"
      v-model:value="currentScript"
      :init="editorInit"
      :lang="mode"
      :options="editorOptions"
      :style="{ height: `${modalHeight}px` }"
      style="width: 100%"
      theme="chrome"
    />
  </div>
</template>

<style lang="scss" scoped>
.editor-wrap {
  position: relative;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;

  .btn-wrap {
    position: absolute;
    top: 8px;
    right: 12px;
    z-index: 99;
    display: flex;

    .btn-item {
      margin-left: 8px;
    }
  }
}
</style>
