<template>
  <div
    class="flex items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
  >
    <!-- Search input -->
    <div class="flex gap-10">
      <el-input
        v-model="searchModel"
        :placeholder="'Qidirish... (F.I.O)'"
        clearable
        @clear="onSearch"
        @keyup.enter="onSearch"
        class="flex-1 max-w-md"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <div class="flex gap-2">
        <!-- Search button -->
        <el-button type="primary" icon="el-icon-search" @click="onSearch">
          Qidirish
        </el-button>

        <!-- Clear button -->
        <el-button v-if="searchModel" @click="clearSearch">Tozalash</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

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

const router = useRouter();

const onSearch = () => {
  emit("search");
};

const clearSearch = () => {
  searchModel.value = "";
  onSearch();
};

const onCreate = () => {
  // Create mode-ga yo'naltirish
  router.push("/projects/create");
};
</script>
