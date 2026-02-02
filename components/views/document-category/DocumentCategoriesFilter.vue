<template>
  <div class="flex flex-col md:flex-row md:items-center gap-3 justify-between">
    <el-input
        v-model="searchModel"
        clearable
        placeholder="Qidirish... (nom bo‘yicha)"
        class="max-w-xl"
        @keyup.enter="$emit('search')"
        @clear="$emit('clear')"
    >
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>

    <div class="text-sm text-gray-600 dark:text-gray-400">
      {{ $t("total") }}: <span class="font-semibold text-gray-900 dark:text-gray-200">{{ total }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Search } from "@element-plus/icons-vue";

const props = defineProps<{
  search: string;
  total: number;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:search", v: string): void;
  (e: "search"): void;
  (e: "clear"): void;
}>();

const searchModel = computed({
  get: () => props.search,
  set: (v) => emit("update:search", v),
});
</script>
