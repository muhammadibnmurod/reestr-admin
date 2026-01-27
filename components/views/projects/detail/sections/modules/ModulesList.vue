<template>
  <div class="modules-shell">
    <el-table
      :data="modules"
      v-loading="loading"
      stripe
      row-key="id"
      class="w-full"
      height="100%"
      header-cell-class-name="modules-head"
      :row-class-name="() => 'modules-row'"
    >
      <!-- INDEX -->
      <el-table-column type="index" label="#" width="60" fixed="left" align="center" />

      <!-- NAME -->
      <el-table-column label="Modul nomi" min-width="220">
        <template #default="{ row }">
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2">
              <span class="font-semibold text-gray-900 dark:text-white">
                {{ row.nameUz || row.nameEn || row.nameRu || row.nameKiril || "-" }}
              </span>

              <span v-if="row.order" class="order-chip">#{{ row.order }}</span>
            </div>

            <span v-if="row.descriptionUz || row.descriptionEn || row.descriptionRu || row.descriptionKiril"
              class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2"
            >
              {{ row.descriptionUz || row.descriptionEn || row.descriptionRu || row.descriptionKiril }}
            </span>
          </div>
        </template>
      </el-table-column>

      <!-- DATES -->
      <el-table-column label="Muddat" width="280">
        <template #default="{ row }">
          <div class="flex flex-col">
            <span class="text-sm text-gray-800 dark:text-gray-200">
              {{ row.startDate || "-" }} → {{ row.endDate || "-" }}
            </span>
            <span class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {{ getDuration(row.startDate, row.endDate) }}
            </span>
          </div>
        </template>
      </el-table-column>

      <!-- COLOR -->
      <el-table-column label="Rang" width="160" align="center">
        <template #default="{ row }">
          <div class="flex items-center justify-center gap-2">
            <span
              class="color-dot"
              :style="{ backgroundColor: row.color || '#e5e7eb' }"
            />
          </div>
        </template>
      </el-table-column>

      <!-- ACTIONS -->
      <el-table-column label="Amallar" width="220" fixed="right" align="center">
        <template #default="{ row }">
          <div class="flex items-center justify-center gap-2">
            <!-- submodules -->
            <el-tooltip content="Submodules" placement="top" >
              <button
                type="button"
                class="action-pill action-sub"
                @click="goSubmodules(row)"
              >
                Submodules
              </button>
            </el-tooltip>

            <!-- edit -->
            <el-tooltip v-if="!readonly" content="Tahrirlash" placement="top">
              <button
                type="button"
                class="action-btn action-edit"
                @click="$emit('edit', row)"
              >
                <el-icon :size="16"><Edit /></el-icon>
              </button>
            </el-tooltip>

            <!-- delete -->
            <el-tooltip v-if="!readonly" content="O‘chirish" placement="top">
              <button
                type="button"
                class="action-btn action-delete"
                @click="$emit('delete', row)"
              >
                <el-icon :size="16"><Delete /></el-icon>
              </button>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>

      <!-- EMPTY -->
      <template #empty>
        <div class="py-12 text-center">
          <div class="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Modul topilmadi
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Qidiruvni o‘zgartiring yoki yangi modul qo‘shing.
          </div>
        </div>
      </template>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { Edit, Delete } from "@element-plus/icons-vue";

const props = defineProps<{
  modules: any[];
  loading?: boolean;
  readonly?: boolean;
  projectId?: number;
}>();

import { useRouter } from "vue-router";
const router = useRouter();

const goSubmodules = (row: any) => {
  console.log('goSubmodules clicked', { projectId: props.projectId, moduleId: row.id });
  if (!props.projectId || !row.id) {
    console.error('Missing projectId or moduleId');
    return;
  }
router.push(`/projects/${props.projectId}/modules/${row.id}`)

};

defineEmits<{
  (e: "edit", row: any): void;
  (e: "delete", row: any): void;
  (e: "view-submodules", row: any): void;
}>();

const getDuration = (start?: string, end?: string) => {
  if (!start || !end) return "—";
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return "—";
  const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "Muddat noto‘g‘ri";
  if (diff === 0) return "1 kun";
  return `${diff + 1} kun`;
};
</script>

<style scoped>
/* shell */
.modules-shell {
  @apply bg-white dark:bg-[#1e222b] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700;
  height: 100%;
}

:deep(.modules-head) {
  @apply bg-gray-50 dark:bg-[#0f172a] text-gray-600 dark:text-gray-300 font-semibold;
}
:deep(.el-table__header-wrapper th.el-table__cell) {
  @apply bg-gray-50 dark:bg-[#0f172a];
}

:deep(.modules-row) td.el-table__cell {
  @apply border-gray-200 dark:border-gray-700;
}
:deep(.el-table__row--striped td.el-table__cell) {
  @apply dark:bg-white/5;
}
:deep(.el-table__body tr:hover > td.el-table__cell) {
  @apply bg-gray-50/60 dark:bg-white/10 transition-colors;
}

.order-chip {
  @apply text-[11px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300;
}

.color-dot {
  @apply inline-block w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-700;
}

.action-btn {
  @apply inline-flex items-center justify-center w-9 h-9 rounded-xl
         transition-all duration-200 select-none border border-transparent;
}
.action-btn:hover {
  @apply -translate-y-0.5 shadow-sm;
}
.action-btn:active {
  @apply translate-y-0 shadow-none;
}

.action-edit {
  @apply bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 hover:text-amber-500
         dark:bg-amber-400/10 dark:text-amber-300 dark:hover:bg-amber-400/20;
}
.action-delete {
  @apply bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:text-red-500
         dark:bg-red-400/10 dark:text-red-300 dark:hover:bg-red-400/20;
}

/* submodules pill */
.action-pill {
  @apply h-8 px-3 rounded-xl text-sm font-semibold transition-all duration-200;
}
.action-sub {
  @apply bg-blue-600   text-white hover:bg-blue-700;
}
</style>
