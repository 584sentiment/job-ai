<template>
  <n-theme-editor>
    <n-message-provider>
      <n-dialog-provider>
        <div :class="['min-h-screen', { 'pb-20': showBottomNav }]">
          <NavBar v-if="showNavBar" />
          <router-view />
          <BottomNav v-if="showBottomNav" />
        </div>
      </n-dialog-provider>
    </n-message-provider>
  </n-theme-editor>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { NMessageProvider, NDialogProvider, NThemeEditor } from 'naive-ui';
import { useAuthStore } from '@/store/auth';
import NavBar from '@/components/NavBar.vue';
import BottomNav from '@/components/BottomNav.vue';

const route = useRoute();
const authStore = useAuthStore();

// 初始化认证状态 - 从 localStorage 恢复登录状态
onMounted(() => {
  authStore.loadState();
});

// 判断是否显示顶部导航栏
const showNavBar = computed(() => {
  return !route.meta?.hideNavBar;
});

// 判断是否显示底部导航栏
const showBottomNav = computed(() => {
  return !route.meta?.hideBottomNav;
});
</script>

<style>
:root {
  --primary: #2563eb;
  --secondary: #3b82f6;
  --cta: #f97316;
  --background: #f8fafc;
  --text: #1e293b;
  --border: #e2e8f0;
}
</style>
