<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4">
    <div class="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
      <el-input
        v-model="model.search"
        :placeholder="$t('common.search') + ' ( Full name / username)'"
        clearable
        @clear="doSearch"
        @keyup.enter="doSearch"
        class="md:flex-1"
        size="large"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <div class="flex items-center gap-2">
        <el-button
          type="primary"
          size="large"
          :icon="Search"
          :loading="loading"
          class="!rounded-xl"
          @click="doSearch"
        >
          {{ $t("common.search") }}
        </el-button>

        <el-button
          size="large"
          class="!rounded-xl"
          :disabled="loading"
          @click="clearSearch"
          v-if="model.search"
        >
          {{ $t("common.clear") || "Tozalash" }}
        </el-button>
      </div>
    </div>

    <div v-if="model.search" class="text-xs mt-2 text-gray-500 dark:text-gray-400">
      Filtr: “{{ model.search }}”
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApiQueryParams } from "@/types/common";
import { useDebounceFn } from "@vueuse/core";
import { Search } from "@element-plus/icons-vue";

const props = defineProps<{ loading?: boolean }>();
const emit = defineEmits(["refresh", "openForm"]);

const model = defineModel<Partial<ApiQueryParams>>({ default: {} });

const doSearch = () => {
  model.value.search = model.value.search?.trim() || "";
  model.value.currentPage = 1;
  emit("refresh");
};

const clearSearch = () => {
  model.value.search = "";
  model.value.currentPage = 1;
  emit("refresh");
};

const debounced = useDebounceFn(doSearch, 600);

// typing bilan ham qidirishni xohlasangiz:
watch(() => model.value.search, () => debounced());
</script>

<style scoped>
:deep(.el-input__wrapper) {
  @apply bg-white dark:bg-gray-800;
}
:deep(.el-input__inner) {
  @apply !bg-white dark:!bg-gray-800;
}
</style>
