<template>
  <div
    class="bg-white dark:bg-[#1e222b] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col h-full"
  >
    <div class="flex-1 min-h-0">
      <el-table
        :data="items"
        v-loading="loading"
        stripe
        row-key="id"
        class="w-full"
        height="100%"
        header-cell-class-name="docs-head"
        :row-class-name="() => 'docs-row'"
        empty-text="Ma’lumot yo‘q"
      >
        <el-table-column type="index" label="#" width="60" fixed="left" />

        <el-table-column label="Nomi" min-width="420">
          <template #default="{ row }">
            <div class="flex flex-col">
              <span class="font-semibold text-gray-900 dark:text-white">
                {{ title(row) }}
              </span>

              <span class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {{ categoryTitle(row.category) }}
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Status" width="170" align="center">
          <template #default="{ row }">
            <span class="status-chip" :class="chipClass(row)">
              {{ chipText(row) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          label="Amallar"
          width="200"
          fixed="right"
          align="center"
        >
          <template #default="{ row }">
            <div class="flex items-center justify-center gap-2 pr-2">
              <!-- ✅ ATTACH only main + file empty -->
              <el-tooltip
                v-if="canAttach(row)"
                content="Fayl biriktirish"
                placement="top"
              >
                <button
                  type="button"
                  class="action-btn action-attach"
                  @click="$emit('attach', row)"
                >
                  <el-icon :size="16"><Link /></el-icon>
                </button>
              </el-tooltip>

              <!-- DOWNLOAD -->
              <el-tooltip content="Yuklab olish" placement="top">
                <button
                  type="button"
                  class="action-btn action-download"
                  :disabled="downloadingId === row.id"
                  @click="$emit('download', row)"
                >
                  <el-icon :size="16"><Download /></el-icon>
                </button>
              </el-tooltip>

              <!-- DELETE -->
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

        <template #empty>
          <div class="py-12 text-center">
            <div class="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Ma’lumot topilmadi
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Yangi hujjat qo‘shing yoki qidiruvni o‘zgartiring.
            </div>
          </div>
        </template>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Delete, Download, Link } from "@element-plus/icons-vue";

const props = defineProps<{
  items: any[];
  loading?: boolean;
  readonly?: boolean;
  downloadingId?: number | null; // ✅ prop qo‘shildi
}>();

defineEmits<{
  (e: "download", row: any): void;
  (e: "delete", row: any): void;
  (e: "attach", row: any): void;
}>();

const title = (row: any) =>
  row?.nameUz || row?.nameEn || row?.nameRu || row?.nameKiril || `#${row?.id}`;

const categoryTitle = (c: any) =>
  c?.nameUz || c?.nameEn || c?.nameRu || c?.nameKiril || "";

const canAttach = (row: any) =>
  row?.type === "main" && (!row?.file || row?.file === "");

const chipText = (row: any) => {
  // main: berilgan/berilmagan; extra ham shunaqa
  return row?.given ? "Berilgan" : "Berilmagan";
};

const chipClass = (row: any) => {
  const base = row?.given ? "is-given" : "is-not-given";
  return row?.type === "extra" ? `is-extra ${base}` : `is-main ${base}`;
};
</script>

<style scoped>
:deep(.docs-head) {
  @apply bg-gray-50 dark:bg-[#0f172a] text-gray-600 dark:text-gray-300 font-semibold;
}
:deep(.el-table__header-wrapper th.el-table__cell) {
  @apply bg-gray-50 dark:bg-[#0f172a];
}
:deep(.docs-row) td.el-table__cell {
  @apply border-gray-200 dark:border-gray-700;
}
:deep(.el-table__row--striped td.el-table__cell) {
  @apply dark:bg-white/5;
}
:deep(.el-table__body tr:hover > td.el-table__cell) {
  @apply bg-gray-50/60 dark:bg-white/10 transition-colors;
}

/* status chip */
.status-chip {
  @apply inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold border;
}
.is-main.is-given {
  @apply bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-300;
}
.is-main.is-not-given {
  @apply bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-200;
}
.is-extra.is-given {
  @apply bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-300;
}
.is-extra.is-not-given {
  @apply bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-300;
}

/* action buttons */
.action-btn {
  @apply inline-flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 select-none border border-transparent;
}
.action-btn:hover {
  @apply -translate-y-0.5 shadow-sm;
}
.action-btn:active {
  @apply translate-y-0 shadow-none;
}
.action-attach {
  @apply bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 hover:text-amber-500
         dark:bg-amber-400/10 dark:text-amber-300 dark:hover:bg-amber-400/20;
}
.action-download {
  @apply bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 hover:text-blue-500
         dark:bg-blue-400/10 dark:text-blue-300 dark:hover:bg-blue-400/20;
}
.action-delete {
  @apply bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:text-red-500
         dark:bg-red-400/10 dark:text-red-300 dark:hover:bg-red-400/20;
}
</style>
