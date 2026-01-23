<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700"
  >
    <el-table
      :data="organizations"
      v-loading="loading"
      stripe
      style="width: 100%"
      height="calc(100vh - 320px)"
      header-cell-class-name="bg-gray-50 dark:bg-gray-700 font-semibold text-gray-700 dark:text-gray-200"
      :row-class-name="
        () => 'hover:bg-gray-50/60 dark:hover:bg-gray-700/40 transition-colors'
      "
    >
      <el-table-column type="index" width="70" label="#" align="center" />

      <el-table-column label="Organization Nomi" min-width="280">
        <template #default="{ row }">
          <div class="flex flex-col">
            <span class="font-semibold text-gray-900 dark:text-gray-100">
              {{ useGetTranslation(row.name) }}
            </span>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              ID: {{ row.id }}
            </span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Parent Organization" min-width="260">
        <template #default="{ row }">
          <span
            v-if="row.parent"
            class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            {{ useGetTranslation(row.parent.name) }}
          </span>
          <span v-else class="text-gray-400">Parent yo‘q</span>
        </template>
      </el-table-column>

      <el-table-column label="Amallar" width="190" align="center" fixed="right">
        <template #default="{ row }">
          <div class="flex justify-center gap-2">
            <el-tooltip content="Ko‘rish" placement="top">
              <el-button
                type="primary"
                :icon="View"
                circle
                size="small"
                plain
                @click="$emit('view', row)"
              />
            </el-tooltip>
            <el-tooltip content="Tahrirlash" placement="top">
              <el-button
                type="warning"
                :icon="Edit"
                circle
                size="small"
                plain
                @click="$emit('edit', row)"
              />
            </el-tooltip>
            <el-tooltip content="O‘chirish" placement="top">
              <el-button
                type="danger"
                :icon="Delete"
                circle
                size="small"
                plain
                @click="$emit('delete', row.id)"
              />
            </el-tooltip>
          </div>
        </template>
      </el-table-column>

      <template #empty>
        <div class="py-10 text-center">
          <div class="text-sm text-gray-600 dark:text-gray-300 font-medium">
            Hech qanday organization topilmadi
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Qidiruvni tozalab ko‘ring yoki “Yangi qo‘shish” ni bosing.
          </div>
        </div>
      </template>
    </el-table>

    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-4 border-t dark:border-gray-700"
    >
      <div class="text-sm text-gray-600 dark:text-gray-400">
        Jami:
        <span class="font-semibold text-gray-800 dark:text-gray-200">{{
          total
        }}</span>
        ta yozuv
      </div>

      <el-pagination
        v-model:current-page="currentPageModel"
        v-model:page-size="pageSizeModel"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="sizes, prev, pager, next, jumper"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { View, Edit, Delete } from "@element-plus/icons-vue";

const props = defineProps<{
  organizations: any[];
  loading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
}>();

const emit = defineEmits([
  "view",
  "edit",
  "delete",
  "page-change",
  "size-change",
]);

const currentPageModel = computed({
  get: () => props.currentPage,
  set: (val) => emit("page-change", val),
});

const pageSizeModel = computed({
  get: () => props.pageSize,
  set: (val) => emit("size-change", val),
});
</script>

<style scoped>
/* Wrapper */
.users-table-wrapper {
  @apply bg-white dark:bg-[#1e222b] rounded-2xl overflow-hidden;
}

/* Table base */
:deep(.el-table) {
  @apply bg-transparent;
}

/* Cells border + default bg */
:deep(.el-table td.el-table__cell) {
  @apply bg-transparent border-gray-200 dark:border-gray-700;
}

/* Header cells */
:deep(.el-table th.el-table__cell) {
  @apply bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 font-semibold;
}

/* Striped rows (Element Plus stripe) */
:deep(.el-table__row--striped td.el-table__cell) {
  @apply dark:bg-white/5;
}

/* Hover rows */
:deep(.el-table__body tr:hover > td.el-table__cell) {
  @apply dark:bg-white/10;
}

/* Pagination container text */
:deep(.el-pagination) {
  @apply text-slate-300;
}

/* Pager items */
:deep(.el-pager li) {
  @apply bg-transparent text-slate-300 rounded-lg;
}

:deep(.el-pager li:hover) {
  @apply bg-white/10;
}

:deep(.el-pager li.is-active) {
  @apply bg-blue-500/20 text-blue-300;
}

/* Prev/Next buttons */
:deep(.el-pagination button) {
  @apply bg-transparent text-slate-300;
}

:deep(.el-pagination button:hover) {
  @apply bg-white/10;
}

/* Pagination select/input wrappers (sizes, jumper) */
:deep(.el-pagination .el-input__wrapper),
:deep(.el-pagination .el-select__wrapper) {
  @apply bg-white/10 shadow-none;
}

/* Pagination input text */
:deep(.el-pagination .el-input__inner) {
  @apply text-gray-200;
}
</style>
