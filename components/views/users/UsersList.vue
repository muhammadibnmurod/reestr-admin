<script setup lang="ts">
import { computed } from "vue";
import { View, Edit, Delete } from "@element-plus/icons-vue";

const props = defineProps<{
  data: any[];
  loading?: boolean;
  page?: number;
  size?: number;
  total?: number;
}>();

const emit = defineEmits([
  "delete",
  "edit",
  "view",
  "page-change",
  "size-change",
]);

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  return `https://reestr.das-uty.uz/api/${imagePath}`;
};

const currentPageModel = computed({
  get: () => props.page || 1,
  set: (v) => emit("page-change", v),
});

const pageSizeModel = computed({
  get: () => props.size || 10,
  set: (v) => emit("size-change", v),
});
</script>

<template>
  <div class="users-shell">
    <!-- TABLE AREA (faqat shu joy scroll bo'ladi) -->
    <div class="users-table-area">
      <el-table
        :data="data"
        v-loading="loading"
        stripe
        class="w-full"
        height="100%"
        header-cell-class-name="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 font-semibold"
        :row-class-name="
          () =>
            'hover:bg-gray-50/60 dark:hover:bg-gray-700/40 transition-colors'
        "
      >
        <el-table-column type="selection" width="55" />

        <el-table-column label="Full name" min-width="260">
          <template #default="scope">
            <div class="flex items-center gap-3">
              <div
                class="relative flex items-center justify-center overflow-hidden rounded-full"
                style="width: 40px; height: 40px"
              >
                <el-image
                  :src="getImageUrl(scope.row.image)"
                  :preview-src-list="[getImageUrl(scope.row.image)]"
                  fit="cover"
                  preview-teleported
                  class="w-full h-full cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <template #error>
                    <div
                      class="flex h-full w-full items-center justify-center bg-gray-200 text-gray-600 font-bold uppercase"
                    >
                      {{ scope.row.fullName?.charAt(0) }}
                    </div>
                  </template>
                </el-image>
              </div>

              <div class="flex flex-col">
                <span class="font-semibold text-gray-900 dark:text-white">
                  {{ scope.row.fullName }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ scope.row.username }}
                </span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Role" width="160">
          <template #default="scope">
            <span
              class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
              :class="
                scope.row.role === 'admin'
                  ? 'bg-red-500/10 text-red-400'
                  : 'bg-blue-500/10 text-blue-400'
              "
            >
              {{ scope.row.role === "admin" ? "Administrator" : "User" }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          label="Actions"
          width="160"
          fixed="right"
          align="center"
        >
          <template #default="{ row }">
            <div class="flex items-center justify-center gap-2">
              <!-- VIEW -->
              <el-tooltip content="Ko‘rish" placement="top">
                <button
                  type="button"
                  class="action-btn action-view"
                  @click="emit('view', row)"
                >
                  <el-icon :size="16"><View /></el-icon>
                </button>
              </el-tooltip>

              <!-- EDIT -->
              <el-tooltip content="Tahrirlash" placement="top">
                <button
                  type="button"
                  class="action-btn action-edit"
                  @click="emit('edit', row)"
                >
                  <el-icon :size="16"><Edit /></el-icon>
                </button>
              </el-tooltip>
              

              <!-- DELETE -->
              <el-tooltip content="O‘chirish" placement="top">
                <el-button
                  circle
                  size="small"
                  class="action-btn action-delete !p-0"
                  @click="emit('delete', row)"
                >
                  <el-icon :size="16"><Delete /></el-icon>
                </el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>

        <template #empty>
          <div class="py-10 text-center">
            <div class="text-sm font-medium text-gray-700 dark:text-gray-200">
              Hech qanday user topilmadi
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Qidiruvni o‘zgartirib ko‘ring yoki yangi user qo‘shing.
            </div>
          </div>
        </template>
      </el-table>
    </div>

    <!-- FOOTER (qotib turadi) -->
    <div class="users-footer">
      <div class="text-sm text-gray-600 dark:text-gray-400">
        Jami:
        <span class="font-semibold text-gray-800 dark:text-gray-200">
          {{ total || 0 }}
        </span>
      </div>

      <el-pagination
        v-model:current-page="currentPageModel"
        v-model:page-size="pageSizeModel"
        :page-sizes="[10, 20, 50, 100]"
        :total="total || 0"
        layout="sizes, prev, pager, next, jumper"
      />
    </div>
  </div>
</template>

<style scoped>
/* ✅ Eng muhim: UsersView list wrapper h-full bo'lsa, bu ham h-full bo'ladi */
.users-shell {
  @apply bg-white dark:bg-[#1e222b] rounded-2xl overflow-hidden flex flex-col h-full;
}

/* ✅ Scroll faqat table body ichida bo'lishi uchun */
.users-table-area {
  @apply flex-1 min-h-0;
}

/* ✅ ElementPlus scroll konteyner (sticky ishlashi uchun) */
:deep(.el-scrollbar__wrap) {
  @apply relative;
}

/* ✅ Real sticky header (scroll paytida qotib turadi) */
:deep(.el-table__header) {
  position: sticky;
  top: 0;
  z-index: 20;
}

/* Header background */
:deep(.el-table__header-wrapper th.el-table__cell) {
  @apply bg-gray-50 dark:bg-[#0f172a] text-gray-600 dark:text-gray-300 font-semibold;
}

/* Table cosmetics */
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

/* Footer fixed inside card */
.users-footer {
  @apply flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-4
         border-t border-gray-200 dark:border-gray-700
         bg-white/90 dark:bg-[#1e222b]/90 backdrop-blur;
}

/* Actions style */
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
