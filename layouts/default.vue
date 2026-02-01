<template>
  <div class="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#2a303c]">
    <AppSidebar :isCollapse="isSidebarCollapsed" />

    <div class="flex flex-col flex-1 min-w-0">
      <header class="shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1d24] z-40 h-20">
        <AppNavbar @toggle-sidebar="toggleSidebar" :collapsed="isSidebarCollapsed" />
      </header>

      <main class="flex-1 p-6 h-full overflow-y-auto bg-[#f8f9fa] dark:bg-[#1e222b]">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

const { data } = useApiService().User.UserController_getMe()

const userInformation = {
  name: data.fullName,
  role: data.role

}

console.log('User Information', userInformation);


const isSidebarCollapsed = ref(false)

function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}
</script>