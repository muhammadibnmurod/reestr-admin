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
      >
        <!-- INDEX -->
        <el-table-column type="index" label="#" width="60" fixed="left" />

        <!-- NAME -->
        <el-table-column label="Nomi" min-width="420">
          <template #default="{ row }">
            <div class="flex flex-col">
              <span class="font-semibold text-gray-900 dark:text-white">
                {{ title(row) }}
              </span>

              <span class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {{ row.category?.nameUz || row.category?.nameEn || row.category?.nameRu || row.category?.nameKiril || "" }}
              </span>
            </div>
          </template>
        </el-table-column>

        <!-- STATUS -->
        <el-table-column label="Status" width="160" align="center">
          <template #default="{ row }">
            <span class="status-chip" :class="row.given ? 'is-given' : 'is-not-given'">
              {{ row.given ? "Berilgan" : "Berilmagan" }}
            </span>
          </template>
        </el-table-column>

        <!-- ACTIONS -->
        <el-table-column label="Amallar" width="220" fixed="right" align="center">
          <template #default="{ row }">
            <div class="flex items-center justify-center gap-2 pr-2">
              <!-- DOWNLOAD -->
              <el-tooltip content="Yuklab olish" placement="top">
                <el-button
                  circle
                  plain
                  type="primary"
                  :loading="downloadingId === row.id"
                  :icon="Download"
                  class="w-10 h-10"
                  @click="$emit('download', row)"
                />
              </el-tooltip>

              <!-- VIEW (optional) -->
              <el-tooltip content="Ko‘rish" placement="top">
                <el-button
                  circle
                  plain
                  type="success"
                  :icon="View"
                  class="w-10 h-10"
                  @click="$emit('view', row)"
                />
              </el-tooltip>

              <!-- DELETE -->
              <el-tooltip v-if="!readonly" content="O‘chirish" placement="top">
                <el-button
                  circle
                  plain
                  type="danger"
                  :icon="Delete"
                  class="w-10 h-10"
                  @click="$emit('delete', row)"
                />
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
import { View, Delete, Download } from "@element-plus/icons-vue";

type ProjectDoc = any;

defineProps<{
  items: ProjectDoc[];
  loading: boolean;
  readonly?: boolean;
  downloadingId?: number | null;
}>();

defineEmits<{
  (e: "download", row: ProjectDoc): void;
  (e: "delete", row: ProjectDoc): void;
  (e: "view", row: ProjectDoc): void;
}>();

const title = (row: any) =>
  row.nameUz || row.nameEn || row.nameRu || row.nameKiril || `#${row.id}`;
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
.status-chip.is-given {
  @apply bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-300;
}
.status-chip.is-not-given {
  @apply bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-300;
}
</style>
