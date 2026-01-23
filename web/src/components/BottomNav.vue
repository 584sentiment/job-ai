<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-border md:hidden">
    <div class="flex justify-around items-center h-16">
      <router-link
        to="/"
        class="flex flex-col items-center justify-center"
        :class="$route.name === 'JobList' ? 'text-primary' : 'text-gray-400'"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
        <span class="text-xs mt-1">岗位</span>
      </router-link>

      <router-link
        to="/interviews"
        class="flex flex-col items-center justify-center"
        :class="$route.name === 'Interviews' ? 'text-primary' : 'text-gray-400'"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <span class="text-xs mt-1">面经</span>
      </router-link>

      <router-link
        to="/summaries"
        class="flex flex-col items-center justify-center"
        :class="$route.name === 'Summaries' ? 'text-primary' : 'text-gray-400'"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
        </svg>
        <span class="text-xs mt-1">总结</span>
      </router-link>

      <router-link
        to="/profile"
        class="flex flex-col items-center justify-center"
        :class="$route.name === 'Profile' ? 'text-primary' : 'text-gray-400'"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        <span class="text-xs mt-1">我的</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
// 底部导航逻辑
</script>
