<template>
  <aside
    class="flex flex-col h-screen bg-[#fafbfc] dark:bg-[#1a1d24] border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out"
    :class="isCollapse ? 'w-20' : 'w-64'" :style="{
      transform: isCollapse ? 'translateX(0)' : 'translateX(0)',
      minWidth: isCollapse ? '5rem' : '16rem'
    }">

    <!-- Header with Logo -->
    <div class="h-20 shrink-0 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
      <div class="flex items-center gap-3 overflow-hidden transition-all duration-300">
        <div class="h-8 w-8 rounded-lg bg-black dark:bg-white flex items-center justify-center shrink-0">
          <img :src="Image" alt="Logo" class="h-5 w-5 object-contain" />
        </div>
        <Transition name="sidebar-text" mode="out-in">
          <span v-if="!isCollapse" class="text-base font-semibold text-gray-900 dark:text-white whitespace-nowrap">
            ByeWind
          </span>
        </Transition>
      </div>
    </div>

    <!-- Main Navigation -->
    <div class="flex-1 overflow-y-auto px-3 pb-4 py-6 scrollbar-thin">
      <nav class="space-y-6">
        <!-- Top Level Items (Overview, Projects) -->
        <div v-if="activeTab === 'favorites'">
          <ul class="space-y-1">
            <li v-for="item in topLevelItems" :key="item.title">
              <router-link :to="item.route"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group"
                :class="isActive(item.route)
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'">
                <component :is="item.icon" class="w-5 h-5 shrink-0" />
                <span v-show="!isCollapse">{{ $t ? $t(item.title) : item.title }}</span>
              </router-link>
            </li>
          </ul>
        </div>
      </nav>
    </div>

    <!-- Footer with SnowUI branding -->
    <Transition name="sidebar-footer" mode="out-in">
      <div v-if="!isCollapse" class="shrink-0 p-4 border-t border-gray-200 dark:border-gray-800">
        <div class="flex items-center gap-2 px-2">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-sm font-semibold text-gray-900 dark:text-white">SnowUI</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">Admin Dashboard</p>
          </div>
        </div>
      </div>
    </Transition>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { navigation } from '@/navigation'
import Image from '@/assets/images/SidebarIMage.png'

type NavItem = {
  title: string
  route: string
  icon: any
  children?: NavItem[]
  badge?: string | number
}

const props = defineProps<{
  isCollapse: boolean
}>()

const route = useRoute()
const activeTab = ref('favorites')
const openSubmenus = ref<string[]>([])

// Navigation dan kelgan ma'lumotlarni guruhlarga bo'lish
const nav = navigation as NavItem[]

// Top level items (Overview, Projects)
const topLevelItems = computed(() =>
  nav.filter(item => !item.title.includes('dashboard') && !item.title.includes('page'))
)

// Dashboard items
const dashboardItems = computed(() =>
  nav.filter(item => item.title.toLowerCase().includes('dashboard') ||
    item.route.includes('/dashboard'))
)

// Page items
const pageItems = computed(() =>
  nav.filter(item => item.title.toLowerCase().includes('page') ||
    item.route.includes('/page') ||
    item.children)
)

// Check if route is active
const isActive = (itemRoute: string) => {
  return route.path === itemRoute || route.path.startsWith(itemRoute + '/')
}

// Check if any child is active
const isActiveParent = (children?: NavItem[]) => {
  if (!children) return false
  return children.some(child => isActive(child.route))
}

// Toggle submenu
const toggleSubmenu = (title: string) => {
  const index = openSubmenus.value.indexOf(title)
  if (index > -1) {
    openSubmenus.value.splice(index, 1)
  } else {
    openSubmenus.value.push(title)
  }
}

// Auto-open active submenus
const initOpenSubmenus = () => {
  pageItems.value.forEach(item => {
    if (item.children && isActiveParent(item.children)) {
      if (!openSubmenus.value.includes(item.title)) {
        openSubmenus.value.push(item.title)
      }
    }
  })
}

// Initialize on mount
import { onMounted } from 'vue'
onMounted(() => {
  initOpenSubmenus()
})
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 9999px;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb {
  background: #374151;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #4b5563;
}

/* Sidebar text transition */
.sidebar-text-enter-active,
.sidebar-text-leave-active {
  transition: all 0.3s ease-in-out;
}

.sidebar-text-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.sidebar-text-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

/* Sidebar footer transition */
.sidebar-footer-enter-active,
.sidebar-footer-leave-active {
  transition: all 0.3s ease-in-out;
}

.sidebar-footer-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.sidebar-footer-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>