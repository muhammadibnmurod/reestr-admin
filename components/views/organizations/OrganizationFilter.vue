<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4">
    <div class="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
      <el-input
        v-model="searchModel"
        placeholder="Tashkilot nomi bo‘yicha qidirish..."
        clearable
        @clear="onSearch"
        @keyup.enter="onSearch"
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
          :icon="Search"
          size="large"
          @click="onSearch"
          class="!rounded-xl"
        >
          Qidirish
        </el-button>

        <el-button
          v-if="searchModel"
          size="large"
          class="!rounded-xl"
          @click="clearSearch"
        >
          Tozalash
        </el-button>
      </div>
    </div>

    <div
      v-if="searchModel"
      class="text-xs mt-2 text-gray-500 dark:text-gray-400"
    >
      Natijalar: “{{ searchModel }}” bo‘yicha filtrlanadi
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Search } from "@element-plus/icons-vue";

const props = defineProps<{
  search: string;
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
