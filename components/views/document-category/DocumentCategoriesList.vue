<template>
  <div class="h-full flex flex-col overflow-hidden">
    <div class="flex-1 min-h-0">
      <el-table
          :data="items"
          v-loading="loading"
          stripe
          row-key="id"
          height="100%"
          class="w-full"
          header-cell-class-name="tbl-head"
          :row-class-name="() => 'tbl-row'"
          empty-text="Ma’lumot yo‘q"
      >
        <el-table-column type="index" label="#" width="60" />

        <el-table-column label="Name (UZ)" min-width="220">
          <template #default="{ row }">
            <div class="font-semibold text-gray-900 dark:text-white">
              {{ row.nameUz }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Amallar" width="170" fixed="right" align="center">
          <template #default="{ row }">
            <div class="flex items-center justify-center gap-2">
              <el-tooltip content="Ko‘rish" placement="top">
                <button type="button" class="action-btn action-view" @click="$emit('view', row)">
                  <el-icon :size="16"><View /></el-icon>
                </button>
              </el-tooltip>

              <el-tooltip content="Tahrirlash" placement="top">
                <button type="button" class="action-btn action-edit" @click="$emit('edit', row)">
                  <el-icon :size="16"><Edit /></el-icon>
                </button>
              </el-tooltip>

              <el-popconfirm
                  :teleported="false"
                  title="O‘chirmoqchimisiz?"
                  confirm-button-text="Ha"
                  cancel-button-text="Yo‘q"
                  @confirm="$emit('delete', row)"
              >
                <template #reference>
                  <el-tooltip content="O‘chirish" placement="top">
                    <button type="button" class="action-btn action-delete">
                      <el-icon :size="16"><Delete /></el-icon>
                    </button>
                  </el-tooltip>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>

        <template #empty>
          <div class="py-10 text-center">
            <div class="text-sm font-medium text-gray-700 dark:text-gray-200">
              Ma’lumot yo‘q
            </div>
          </div>
        </template>
      </el-table>
    </div>

    <div class="list-footer">
      <div class="text-sm text-gray-600 dark:text-gray-400">
       {{ $t("total") }}: <span class="font-semibold text-gray-900 dark:text-gray-200">{{ total }}</span>
      </div>

      <el-pagination
          v-model:current-page="pageModel"
          v-model:page-size="sizeModel"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="sizes, prev, pager, next, jumper"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Edit, Delete, View } from "@element-plus/icons-vue";

const props = defineProps<{
  items: any[];
  loading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
}>();

const emit = defineEmits<{
  (e: "view", row: any): void;
  (e: "edit", row: any): void;
  (e: "delete", row: any): void;
  (e: "page-change", page: number): void;
  (e: "size-change", size: number): void;
}>();

const pageModel = computed({
  get: () => props.currentPage,
  set: (v) => emit("page-change", v),
});
const sizeModel = computed({
  get: () => props.pageSize,
  set: (v) => emit("size-change", v),
});
</script>

<style scoped>
:deep(.tbl-head) {
  @apply bg-gray-50 dark:bg-[#0f172a] text-gray-600 dark:text-gray-300 font-semibold;
}
:deep(.el-table__header-wrapper th.el-table__cell) {
  @apply bg-gray-50 dark:bg-[#0f172a];
}
:deep(.tbl-row) td.el-table__cell {
  @apply border-gray-200 dark:border-gray-700;
}
:deep(.el-table__row--striped td.el-table__cell) {
  @apply dark:bg-white/5;
}
:deep(.el-table__body tr:hover > td.el-table__cell) {
  @apply bg-gray-50/60 dark:bg-white/10 transition-colors;
}

.list-footer {
  @apply flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4
  border-t border-gray-200 dark:border-gray-700
  bg-white/90 dark:bg-[#1e222b]/90 backdrop-blur;
}

.action-btn {
  @apply inline-flex items-center justify-center w-9 h-9 rounded-xl
  transition-all duration-200 select-none border border-transparent;
}
.action-view {
  @apply bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 hover:text-blue-400
  dark:bg-blue-400/10 dark:text-blue-300 dark:hover:bg-blue-400/20;
}
.action-edit {
  @apply bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 hover:text-amber-500
  dark:bg-amber-400/10 dark:text-amber-300 dark:hover:bg-amber-400/20;
}
.action-delete {
  @apply bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:text-red-500
  dark:bg-red-400/10 dark:text-red-300 dark:hover:bg-red-400/20;
}
.action-btn:hover {
  @apply -translate-y-0.5 shadow-sm;
}
.action-btn:active {
  @apply translate-y-0 shadow-none;
}
</style>
