<template>
  <n-message-provider>
    <n-dialog-provider>
      <div :class="['min-h-screen', { 'pb-20': showBottomNav }]">
        <NavBar v-if="showNavBar" />
        <router-view />
        <BottomNav v-if="showBottomNav" />
      </div>
    </n-dialog-provider>
  </n-message-provider>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { NMessageProvider, NDialogProvider } from 'naive-ui'
import { useAuthStore } from '@/store/auth'
import NavBar from '@/components/NavBar.vue'
import BottomNav from '@/components/BottomNav.vue'

const route = useRoute()
const authStore = useAuthStore()

// 初始化认证状态 - 从 localStorage 恢复登录状态
onMounted(() => {
  authStore.loadState()
})

// 判断是否显示顶部导航栏
const showNavBar = computed(() => {
  return !route.meta?.hideNavBar
})

// 判断是否显示底部导航栏
const showBottomNav = computed(() => {
  return !route.meta?.hideBottomNav
})
</script>

<style>
:root {
  --primary: #2563EB;
  --secondary: #3B82F6;
  --cta: #F97316;
  --background: #F8FAFC;
  --text: #1E293B;
  --border: #E2E8F0;
}
</style>
