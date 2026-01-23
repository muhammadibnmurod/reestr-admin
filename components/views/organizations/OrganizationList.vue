<template>
  <div class="list-shell">
    <!-- TABLE AREA (faqat shu joy scroll) -->
    <div class="table-area">
      <el-table
        :data="organizations"
        v-loading="loading"
        stripe
        class="w-full"
        :height="tableHeight"
        header-cell-class-name="bg-gray-50 dark:bg-[#0f172a] text-gray-600 dark:text-gray-300 font-semibold"
        :row-class-name="
          () =>
            'hover:bg-gray-50/60 dark:hover:bg-gray-700/40 transition-colors'
        "
      >
        <el-table-column type="index" width="60" label="#" align="center" />

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
              class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-slate-500/10 text-slate-600 dark:bg-white/10 dark:text-slate-200"
            >
              {{ useGetTranslation(row.parent.name) }}
            </span>
            <span v-else class="text-gray-400">Parent yo'q</span>
          </template>
        </el-table-column>

        <el-table-column
          label="Amallar"
          width="170"
          fixed="right"
          align="center"
        >
          <template #default="{ row }">
            <div class="flex items-center justify-center gap-2">
              <el-tooltip content="Ko'rish" placement="top">
                <button
                  type="button"
                  class="action-btn action-view"
                  @click="emit('view', row)"
                >
                  <el-icon :size="16"><View /></el-icon>
                </button>
              </el-tooltip>

              <el-tooltip content="Tahrirlash" placement="top">
                <button
                  type="button"
                  class="action-btn action-edit"
                  @click="emit('edit', row)"
                >
                  <el-icon :size="16"><Edit /></el-icon>
                </button>
              </el-tooltip>

              <el-popconfirm
                title="Haqiqatdan ham o'chirmoqchimisiz?"
                confirm-button-text="Ha"
                cancel-button-text="Yo'q"
                @confirm="emit('delete', row.id)"
              >
                <template #reference>
                  <el-tooltip content="O'chirish" placement="top">
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
            <div class="text-sm text-gray-600 dark:text-gray-300 font-medium">
              Hech qanday organization topilmadi
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Qidiruvni tozalab ko'ring yoki "Yangi qo'shish" ni bosing.
            </div>
          </div>
        </template>
      </el-table>
    </div>

    <!-- FOOTER pinned -->
    <div class="list-footer">
      <div class="text-sm text-gray-600 dark:text-gray-400">
        Jami:
        <span class="font-semibold text-gray-800 dark:text-gray-200">
          {{ total }}
        </span>
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
import { computed, ref, onMounted, onUnmounted } from "vue";
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

// ❗️Table height ni dynamic hisoblash
const tableHeight = ref(0);

const calculateTableHeight = () => {
  // Footer balandligi (~80px) ni ayirib, qolganini table ga beramiz
  const footerHeight = 80;
  const parentHeight = document.querySelector(".list-shell")?.clientHeight || 0;
  tableHeight.value = parentHeight - footerHeight;
};

onMounted(() => {
  calculateTableHeight();
  window.addEventListener("resize", calculateTableHeight);
});

onUnmounted(() => {
  window.removeEventListener("resize", calculateTableHeight);
});
</script>

<style scoped>
/* EmployeesList bilan 1 xil shell */
.list-shell {
  @apply h-full flex flex-col overflow-hidden;
}

/* scroll faqat table qismida */
.table-area {
  @apply flex-1 min-h-0;
}

/* table cosmetics */
:deep(.el-table) {
  @apply bg-transparent;
}
:deep(.el-table td.el-table__cell) {
  @apply bg-transparent border-gray-200 dark:border-gray-700;
}
:deep(.el-table th.el-table__cell) {
  @apply bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 font-semibold;
}
:deep(.el-table__row--striped td.el-table__cell) {
  @apply dark:bg-white/5;
}
:deep(.el-table__body tr:hover > td.el-table__cell) {
  @apply dark:bg-white/10;
}

/* footer pinned (EmployeesList bilan 1 xil) */
.list-footer {
  @apply flex-shrink-0 flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4
         border-t border-gray-200 dark:border-gray-700
         bg-white/90 dark:bg-[#1e222b]/90 backdrop-blur;
}

/* pagination style (EmployeesList bilan 1 xil) */
:deep(.el-pagination) {
  @apply text-slate-300;
}
:deep(.el-pager li) {
  @apply bg-transparent text-slate-300 rounded-lg;
}
:deep(.el-pager li:hover) {
  @apply bg-white/10;
}
:deep(.el-pager li.is-active) {
  @apply bg-blue-500/20 text-blue-300;
}
:deep(.el-pagination button) {
  @apply bg-transparent text-slate-300;
}
:deep(.el-pagination button:hover) {
  @apply bg-white/10;
}
:deep(.el-pagination .el-input__wrapper),
:deep(.el-pagination .el-select__wrapper) {
  @apply bg-white/10 shadow-none;
}
:deep(.el-pagination .el-input__inner) {
  @apply text-gray-200;
}

/* actions (EmployeesList bilan 1 xil) */
.action-btn {
  @apply inline-flex items-center justify-center w-9 h-9 rounded-xl
         transition-all duration-200 select-none border border-transparent;
}
.action-view {
  @apply bg-blue-500/10 text-blue-500
         hover:bg-blue-500/20 hover:text-blue-400
         dark:bg-blue-400/10 dark:text-blue-300
         dark:hover:bg-blue-400/20;
}
.action-edit {
  @apply bg-amber-500/10 text-amber-600
         hover:bg-amber-500/20 hover:text-amber-500
         dark:bg-amber-400/10 dark:text-amber-300
         dark:hover:bg-amber-400/20;
}
.action-delete {
  @apply bg-red-500/10 text-red-600
         hover:bg-red-500/20 hover:text-red-500
         dark:bg-red-400/10 dark:text-red-300
         dark:hover:bg-red-400/20;
}
.action-btn:hover {
  @apply -translate-y-0.5 shadow-sm;
}
.action-btn:active {
  @apply translate-y-0 shadow-none;
}
</style>
