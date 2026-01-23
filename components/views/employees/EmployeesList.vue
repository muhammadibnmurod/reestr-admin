<template>
  <div class="list-shell">
    <!-- TABLE SCROLL AREA (faqat shu joy scroll) -->
    <div class="table-area">
      <el-table
        :data="employees"
        v-loading="loading"
        stripe
        class="w-full"
        :empty-text="$t('common.noData')"
        height="100%"
        header-cell-class-name="bg-gray-50 dark:bg-[#0f172a] text-gray-600 dark:text-gray-300 font-semibold"
        :row-class-name="() => 'hover:bg-gray-50/60 dark:hover:bg-gray-700/40 transition-colors'"
      >
        <el-table-column type="index" width="60" label="#" />

        <el-table-column label="Rasm" width="100">
          <template #default="{ row }">
            <div class="flex items-center justify-center">
              <el-image
                style="width: 44px; height: 44px; border-radius: 9999px"
                :src="getImageUrl(row.image)"
                :preview-src-list="[getImageUrl(row.image)]"
                fit="cover"
                preview-teleported
                class="cursor-pointer ring-2 ring-gray-200 dark:ring-gray-700"
              >
                <template #error>
                  <div
                    class="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-200 font-semibold"
                  >
                    {{ row.fullNameUz?.charAt(0) || "?" }}
                  </div>
                </template>
              </el-image>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="fullNameUz" label="F.I.O" min-width="240">
          <template #default="{ row }">
            <div class="flex flex-col">
              <span class="font-semibold text-gray-900 dark:text-white">
                {{ row.fullNameUz }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ row.positionUz || "" }}
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="positionUz" label="Lavozim" min-width="180">
          <template #default="{ row }">
            <span
              class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
                     bg-slate-500/10 text-slate-600 dark:bg-white/10 dark:text-slate-200"
            >
              {{ row.positionUz || "-" }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="Yaratilgan sana" width="160">
          <template #default="{ row }">
            <div class="text-gray-600 dark:text-gray-400 text-sm">
              {{ formatDate(row.createdAt) }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Manager ID" width="120" align="center">
          <template #default="{ row }">
            <span
              v-if="row.managerId"
              class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
                     bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300"
            >
              {{ row.managerId }}
            </span>
            <span v-else class="text-gray-400">-</span>
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
                title="Ushbu xodimni o‘chirmoqchimisiz?"
                confirm-button-text="Ha"
                cancel-button-text="Yo‘q"
                @confirm="$emit('delete', row.id)"
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
              {{ $t("common.noData") }}
            </div>
          </div>
        </template>
      </el-table>
    </div>

    <!-- FOOTER (pagination qotib turadi) -->
    <div class="list-footer">
      <div class="text-sm text-gray-600 dark:text-gray-400">
        Jami: <span class="font-semibold text-gray-800 dark:text-gray-200">{{ total }}</span> ta yozuv
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
import { Edit, Delete, View } from "@element-plus/icons-vue";

const props = defineProps<{
  employees: any[];
  loading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
}>();

const emit = defineEmits<{
  (e: "edit", employee: any): void;
  (e: "view", employee: any): void;
  (e: "delete", id: number): void;
  (e: "page-change", page: number): void;
  (e: "size-change", size: number): void;
}>();

const currentPageModel = computed({
  get: () => props.currentPage,
  set: (val) => emit("page-change", val),
});

const pageSizeModel = computed({
  get: () => props.pageSize,
  set: (val) => emit("size-change", val),
});

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  return `https://reestr.das-uty.uz/api/${imagePath}`;
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("uz-UZ", { year: "numeric", month: "2-digit", day: "2-digit" });
};
</script>

<style scoped>
/* Card shell (EmployeeView'dagi h-full container ichida ishlaydi) */
.list-shell {
  @apply h-full flex flex-col overflow-hidden;
}

.table-area {
  @apply flex-1 min-h-0;
}

/* table cosmetics (User bilan bir xil) */
:deep(.el-table) {
  @apply bg-transparent;
}
:deep(.el-table td.el-table__cell) {
  @apply bg-transparent border-gray-200 dark:border-gray-700;
}
:deep(.el-table__row--striped td.el-table__cell) {
  @apply dark:bg-white/5;
}
:deep(.el-table__body tr:hover > td.el-table__cell) {
  @apply dark:bg-white/10;
}

/* Footer pinned */
.list-footer {
  @apply flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4
         border-t border-gray-200 dark:border-gray-700
         bg-white/90 dark:bg-[#1e222b]/90 backdrop-blur;
}

/* Pagination (User bilan bir xil) */
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

/* Actions (User bilan bir xil premium) */
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
