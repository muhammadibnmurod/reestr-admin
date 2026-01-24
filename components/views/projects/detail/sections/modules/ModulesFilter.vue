<template>
  <div class="bg-gray-50 dark:bg-gray-900/40 rounded-2xl p-4">
    <div class="flex flex-col md:flex-row md:items-center gap-3">
      <el-input
        v-model="searchModel"
        placeholder="Modul bo‘yicha qidirish... (nom/tavsif)"
        clearable
        size="large"
        class="md:flex-1"
        @keyup.enter="emit('search')"
        @clear="emit('clear')"
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
          class="!rounded-xl"
          :loading="loading"
          @click="emit('search')"
        >
          Qidirish
        </el-button>

        <el-button
          v-if="searchModel"
          size="large"
          class="!rounded-xl"
          @click="clear"
        >
          Tozalash
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Search } from "@element-plus/icons-vue";

const props = defineProps<{
  search: string;
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

const clear = () => {
  searchModel.value = "";
  emit("clear");
};
</script>

<style scoped>
:deep(.el-input__wrapper) {
  @apply !rounded-xl;
}
</style>
