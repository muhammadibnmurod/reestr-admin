<template>
  <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-4">
    <div class="flex gap-4 items-center">
      <el-input
        v-model="searchModel"
        placeholder="Qidirish (Name)"
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

      <el-button v-if="searchModel" @click="clearSearch"> Tozalash </el-button>
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
