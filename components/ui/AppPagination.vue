<template>
  <div
    class="flex items-center justify-between w-full px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700/50 backdrop-blur-sm"
  >
    <div class="flex items-center gap-2">
      <span
        class="text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700"
      >
        {{ $t("total") }}:
        <span class="font-bold text-slate-900 dark:text-white ml-1">
          {{ total }}
        </span>
        ta
      </span>
    </div>

    <el-pagination
      v-model:current-page="params.currentPage"
      v-model:page-size="params.pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :background="true"
      layout="sizes, prev, pager, next, jumper"
      :total="total"
      class="modern-pagination"
      @size-change="$emit('changeSize', $event)"
      @current-change="$emit('changePage', $event)"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  total: number;
  params: any;
}>();

defineEmits(["changeSize", "changePage"]);
</script>

<style scoped>
:deep(.modern-pagination) {
  --el-pagination-button-color: rgb(71 85 105);
  --el-pagination-hover-color: rgb(59 130 246);
  --el-pagination-button-disabled-color: rgb(203 213 225);
  --el-pagination-button-disabled-bg-color: rgb(241 245 249);
}

:deep(.el-pagination.is-background .btn-next),
:deep(.el-pagination.is-background .btn-prev),
:deep(.el-pagination.is-background .el-pager li) {
  background-color: white;
  border: 1px solid rgb(226 232 240);
  color: rgb(71 85 105);
  font-weight: 500;
  transition: all 0.2s ease;
}

:deep(.dark .el-pagination.is-background .btn-next),
:deep(.dark .el-pagination.is-background .btn-prev),
:deep(.dark .el-pagination.is-background .el-pager li) {
  background-color: rgb(30 41 59);
  border: 1px solid rgb(51 65 85);
  color: rgb(226 232 240);
}

:deep(.el-pagination.is-background .el-pager li:hover) {
  color: rgb(59 130 246);
  border-color: rgb(59 130 246);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

:deep(.el-pagination.is-background .el-pager li.is-active) {
  background: linear-gradient(135deg, rgb(59 130 246), rgb(37 99 235));
  color: white;
  border-color: rgb(59 130 246);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}

:deep(.el-pagination.is-background .btn-next:hover),
:deep(.el-pagination.is-background .btn-prev:hover) {
  color: rgb(59 130 246);
  border-color: rgb(59 130 246);
  transform: translateY(-2px);
}

:deep(.el-select .el-input__wrapper) {
  background-color: white;
  border: 1px solid rgb(226 232 240);
  border-radius: 8px;
  transition: all 0.2s ease;
}

:deep(.dark .el-select .el-input__wrapper) {
  background-color: rgb(30 41 59);
  border: 1px solid rgb(51 65 85);
}

:deep(.el-select .el-input__wrapper:hover) {
  border-color: rgb(59 130 246);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}
</style>
