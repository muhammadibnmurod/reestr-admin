<template>
  <div class="flex items-center gap-4">
    <!-- <div class="rounded-2xl">
      <el-input
      id="search"
        :model-value="model.search"
        :placeholder="$t('common.search')"
        
        
        :suffix-icon="Search"
        class=""
        @update:model-value="search"
      />
    </div> -->

    <div class="flex items-center gap-4">
      <el-button
        :icon="ElIconPlus"
        type="primary"
        @click="emit('openForm', false)"
        class="!px-5 !py-5 !rounded-xl"
      >
        {{ $t("common.add") }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApiQueryParams } from "@/types/common";
import { useDebounceFn } from "@vueuse/core";
import { Plus as ElIconPlus, Search } from "@element-plus/icons-vue";

defineProps<{
  filterParams: ApiQueryParams;
}>();

const emit = defineEmits(["refresh", "openForm"]);

const model = defineModel<Partial<ApiQueryParams>>({
  default: {},
});

const search = useDebounceFn(() => {
  model.value.search = model.value.search?.trim() || undefined;
  emit("refresh");
}, 1000);
</script>

<style>
  .el-input__wrapper {
    @apply bg-white dark:bg-gray-800;
  }
  .el-input__inner {
    @apply !bg-white dark:!bg-gray-800;
  }
</style>
