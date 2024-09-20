<script lang="ts" setup>
import { computed } from 'vue';

import { AuthenticationLoginExpiredModal } from '@vben/common-ui';
import { BasicLayout, LockScreen, UserDropdown } from '@vben/layouts';
import { preferences } from '@vben/preferences';
import { useAccessStore, useUserStore } from '@vben/stores';

import { useAuthStore } from '#/store';
import LoginForm from '#/views/_core/authentication/login.vue';

const userStore = useUserStore();
const authStore = useAuthStore();
const accessStore = useAccessStore();
const menus = computed(() => [
  // {
  //   handler: () => {
  //     openWindow(`${VBEN_GITHUB_URL}/issues`, {
  //       target: '_blank',
  //     });
  //   },
  //   icon: CircleHelp,
  //   text: $t('widgets.qa'),
  // },
]);

const avatar = computed(() => {
  return userStore.userInfo?.head_image ?? preferences.app.defaultAvatar;
});

async function handleLogout() {
  await authStore.logout(false);
}
</script>

<template>
  <BasicLayout @clear-preferences-and-logout="handleLogout">
    <template #user-dropdown>
      <UserDropdown
        :avatar
        :description="userStore.userInfo?.description"
        :menus
        :text="userStore.userInfo?.name"
        tag-text="admin"
        @logout="handleLogout"
      />
    </template>
    <template #extra>
      <AuthenticationLoginExpiredModal
        v-model:open="accessStore.loginExpired"
        :avatar
      >
        <LoginForm />
      </AuthenticationLoginExpiredModal>
    </template>
    <template #lock-screen>
      <LockScreen :avatar @to-login="handleLogout" />
    </template>
  </BasicLayout>
</template>
