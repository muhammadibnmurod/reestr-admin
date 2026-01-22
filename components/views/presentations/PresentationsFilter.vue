<template>
  <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
    <div class="flex gap-4 items-center flex-wrap">
      <el-input
        v-model="searchModel"
        placeholder="Qidirish... (Sarlavha, tavsif)"
        clearable
        @clear="onSearch"
        @keyup.enter="onSearch"
        class="flex-1 max-w-md"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <el-button type="primary" :icon="Search" @click="onSearch">
        Qidirish
      </el-button>

      <el-button v-if="searchModel" @click="clearSearch" plain>
        <template #icon>
          <el-icon><Close /></el-icon>
        </template>
        Tozalash
      </el-button>

      <div class="flex-1"></div>

      <!-- Statistics -->
      <div class="flex items-center gap-4 text-sm">
        <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <el-icon><Document /></el-icon>
          <span>Jami taqdimotlar:</span>
          <span class="font-bold text-blue-600 dark:text-blue-400">
            {{ totalCount }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Search, Close, Document } from "@element-plus/icons-vue";

const props = defineProps<{
  search: string;
  totalCount?: number;
}>();

const emit = defineEmits<{
  (e: "update:search", value: string): void;
  (e: "search"): void;
}>();

const searchModel = computed({
  get: () => props.search,
  set: (val) => emit("update:search", val),
});

const onSearch = () => {
  emit("search");
};

const clearSearch = () => {
  searchModel.value = "";
  onSearch();
};
</script>

<style scoped>
:deep(.el-input__wrapper) {
  @apply shadow-sm transition-all duration-200;
}

:deep(.el-input__wrapper:hover) {
  @apply shadow-md;
}

:deep(.el-input__wrapper.is-focus) {
  @apply shadow-lg ring-2 ring-blue-100 dark:ring-blue-900/50;
}
</style>