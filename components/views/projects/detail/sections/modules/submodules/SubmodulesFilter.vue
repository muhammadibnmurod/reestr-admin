<template>
  <div class="bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-200/70 dark:border-gray-700/70 p-4">
    <div class="flex items-center gap-3 flex-wrap">
      <el-input
        v-model="searchModel"
        placeholder="Qidirish... (nom, status)"
        clearable
        @clear="emit('search')"
        @keyup.enter="emit('search')"
        class="max-w-md"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <el-button type="primary" class="!rounded-xl" @click="emit('search')">
        Qidirish
      </el-button>

      <el-button v-if="searchModel" class="!rounded-xl" @click="clear">
        Tozalash
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Search } from "@element-plus/icons-vue";

const props = defineProps<{ search: string }>();
const emit = defineEmits<{
  (e: "update:search", v: string): void;
  (e: "search"): void;
}>();

const searchModel = computed({
  get: () => props.search,
  set: (v) => emit("update:search", v),
});

const clear = () => {
  searchModel.value = "";
  emit("search");
};
</script>
