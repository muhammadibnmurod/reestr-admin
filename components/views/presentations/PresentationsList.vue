<template>
  <div class="presentations-shell">
    <!-- TABLE AREA (faqat shu scroll bo‘ladi) -->
    <div class="presentations-table-area">
      <el-table
        :data="presentations"
        v-loading="loading"
        stripe
        row-key="id"
        class="w-full"
        height="100%"
        header-cell-class-name="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 font-semibold"
        :row-class-name="
          () =>
            'hover:bg-gray-50/60 dark:hover:bg-gray-700/40 transition-colors'
        "
      >
        <!-- INDEX -->
        <el-table-column type="index" label="#" width="60" fixed="left" />

        <!-- ORDER -->
        <el-table-column label="Tartib" width="90" align="center">
          <template #default="{ row }">
            <span class="order-badge">
              {{ row.order ?? "-" }}
            </span>
          </template>
        </el-table-column>

        <!-- LOGO -->
        <el-table-column label="Logo" width="120" align="center">
          <template #default="{ row }">
            <div class="img-wrap img-sm">
              <el-image
                :src="getImageUrl(row.logo)"
                :preview-src-list="[getImageUrl(row.logo)]"
                fit="cover"
                preview-teleported
                class="w-full h-full"
              >
                <template #error>
                  <div class="img-fallback">L</div>
                </template>
              </el-image>
            </div>
          </template>
        </el-table-column>

        <!-- IMAGE -->
        <el-table-column label="Banner" width="140" align="center">
          <template #default="{ row }">
            <div class="img-wrap img-md">
              <el-image
                :src="getImageUrl(row.image)"
                :preview-src-list="[getImageUrl(row.image)]"
                fit="cover"
                preview-teleported
                class="w-full h-full"
              >
                <template #error>
                  <div class="img-fallback">IMG</div>
                </template>
              </el-image>
            </div>
          </template>
        </el-table-column>

        <!-- TITLE -->
        <el-table-column label="Sarlavha" min-width="360">
          <template #default="{ row }">
            <div class="flex flex-col">
              <span class="font-semibold text-gray-900 dark:text-white">
                {{ row.titleUz || "-" }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {{ row.subtitleUz || "-" }}
              </span>

              <span
                v-if="row.descriptionUz"
                class="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2"
              >
                {{ row.descriptionUz }}
              </span>
            </div>
          </template>
        </el-table-column>

        <!-- COLOR -->
        <el-table-column label="Rang" width="140" align="center">
          <template #default="{ row }">
            <div class="flex items-center justify-center gap-2">
              <span
                class="color-dot"
                :style="{ backgroundColor: row.color || '#e5e7eb' }"
              />
              <!-- <span class="text-xs text-gray-600 dark:text-gray-300 font-mono">
                {{ row.color || "-" }}
              </span> -->
            </div>
          </template>
        </el-table-column>

        <!-- FEATURES -->
        <el-table-column label="Xususiyatlar" width="150" align="center">
          <template #default="{ row }">
            <span class="feature-badge">
              {{ row.features?.length || 0 }} ta
            </span>
          </template>
        </el-table-column>

        <!-- DATE -->
        <el-table-column label="Sana" width="180">
          <template #default="{ row }">
            <span class="text-sm text-gray-700 dark:text-gray-300">
              {{ formatDate(row.createdAt) }}
            </span>
          </template>
        </el-table-column>

        <!-- ACTIONS -->
        <el-table-column label="Amallar" width="190" fixed="right" align="center">
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

              <el-tooltip content="O‘chirish" placement="top">
                <button type="button" class="action-btn action-delete" @click="$emit('delete', row.id)">
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
              Ma'lumot topilmadi
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Qidiruvni o‘zgartiring yoki yangi taqdimot qo‘shing.
            </div>
          </div>
        </template>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Edit, View, Delete } from "@element-plus/icons-vue";
import type { Presentation } from "@/types";

defineProps<{
  presentations: Presentation[];
  loading: boolean;
}>();

defineEmits<{
  (e: "edit", row: Presentation): void;
  (e: "view", row: Presentation): void;
  (e: "delete", id: number): void;
}>();

const getImageUrl = (path?: string) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `https://reestr.das-uty.uz/api/${path}`;
};

const formatDate = (date?: string) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("uz-UZ");
};
</script>

<style scoped>
/* shell */
.presentations-shell {
  @apply bg-white dark:bg-[#1e222b] rounded-2xl overflow-hidden flex flex-col h-full;
}
.presentations-table-area {
  @apply flex-1 min-h-0;
}

/* sticky header */
:deep(.el-scrollbar__wrap) {
  @apply relative;
}
:deep(.el-table__header) {
  position: sticky;
  top: 0;
  z-index: 20;
}
:deep(.el-table__header-wrapper th.el-table__cell) {
  @apply bg-gray-50 dark:bg-[#0f172a] text-gray-600 dark:text-gray-300 font-semibold;
}

/* rows */
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

/* image */
/* .img-wrap {
  @apply overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800;
} */
.img-sm {
  width: 5.75rem;
  /* height: 2px; */
  margin: 0 auto;
}
.img-md {
  width: 90px;
  /* height: 52px; */
  margin: 0 auto;
}
.img-fallback {
  @apply w-full h-full flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-300;
}

/* badges */
.order-badge {
  @apply inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold
         bg-amber-500/10 text-amber-600 dark:text-amber-300;
}
.feature-badge {
  @apply inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold
         bg-emerald-500/10 text-emerald-600 dark:text-emerald-300;
}
.color-dot {
  @apply inline-block w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700;
}

/* actions */
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
