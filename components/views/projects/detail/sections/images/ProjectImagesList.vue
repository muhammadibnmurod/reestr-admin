<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full"
  >
    <!-- table area -->
    <div class="flex-1 min-h-0">
      <el-table
        :data="items"
        v-loading="loading"
        stripe
        row-key="id"
        height="100%"
        class="w-full"
        header-cell-class-name="img-head"
        :row-class-name="() => 'img-row'"
      >
        <el-table-column type="index" label="#" width="60" fixed="left" />

        <!-- IMAGE (rasm o'z proporsiyasida) -->
        <el-table-column label="Rasm" min-width="260">
          <template #default="{ row }">
            <div class="flex items-center gap-4">
              <div
                class="inline-flex overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40"
              >
                <!-- rasmga majburiy width/height bermaymiz -->
                <el-image
                  :src="getImageUrl(row.image)"
                  :preview-src-list="[getImageUrl(row.image)]"
                  fit="contain"
                  preview-teleported
                  class="max-w-[90px] h-auto"
                >
                  <template #error>
                    <div
                      class="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-300"
                    >
                      IMG
                    </div>
                  </template>
                </el-image>
              </div>

              <!-- <div class="flex flex-col min-w-0">
                <div class="text-sm font-semibold text-gray-900 dark:text-white">
                  #{{ row.id }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {{ getImageUrl(row.image) }}
                </div>
              </div> -->
            </div>
          </template>
        </el-table-column>

        <!-- DATE -->
        <el-table-column label="Yuklangan sana" width="400">
          <template #default="{ row }">
            <span class="text-sm text-gray-700 dark:text-gray-200">
              {{ formatDate(row.createdAt) }}
            </span>
          </template>
        </el-table-column>

        <!-- ACTIONS -->
        <el-table-column label="Amallar" width="140" fixed="right" align="center">
          <template #default="{ row }">
            <div class="flex items-center justify-center gap-2">
              <el-tooltip content="Ko‘rish" placement="top">
                <button
                  type="button"
                  class="action-btn action-view"
                  @click="preview(row)"
                >
                  <el-icon :size="16"><View /></el-icon>
                </button>
              </el-tooltip>

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
              Rasm topilmadi
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Yangi rasm yuklab ko‘ring.
            </div>
          </div>
        </template>
      </el-table>
    </div>

    <div
      class="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-end"
    >
      <el-pagination
        v-model:current-page="pageModel"
        v-model:page-size="sizeModel"
        :page-sizes="[10, 20, 50]"
        :total="total"
        layout="total, sizes, prev, pager, next"
      />
    </div>

    <el-dialog
      v-model="previewOpen"
      :width="previewWidth"
      append-to-body
      destroy-on-close
      class="img-preview-dialog"
    >
      <template #header>
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="text-lg font-bold text-gray-900 dark:text-white">
            Rasm
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            #{{ previewRow?.id }}
          </div>
        </div>
      </template>

      <div class="px-6 py-5">
        <div
          class="inline-flex rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30"
        >
          <img
            v-if="previewRow"
            :src="getImageUrl(previewRow.image)"
            alt="preview"
            class="block max-w-full h-auto"
          />
        </div>
      </div>

      <template #footer>
        <div
          class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end"
        >
          <el-button class="!rounded-xl" @click="previewOpen = false">
            Yopish
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { View, Delete } from "@element-plus/icons-vue";

type ProjectImage = {
  id: number;
  image: string;
  createdAt?: string;
};

const props = defineProps<{
  items: ProjectImage[];
  loading: boolean;
  readonly?: boolean;

  total: number;
  currentPage: number;
  pageSize: number;
}>();

const emit = defineEmits<{
  (e: "page-change", v: number): void;
  (e: "size-change", v: number): void;
  (e: "delete", row: ProjectImage): void;
}>();

const pageModel = computed({
  get: () => props.currentPage,
  set: (v) => emit("page-change", v),
});

const sizeModel = computed({
  get: () => props.pageSize,
  set: (v) => emit("size-change", v),
});

const getImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) {
    return path;
  }
  return `https://reestr.das-uty.uz/api/${path}`;
};

const formatDate = (date?: string) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("uz-UZ");
};

/** preview */
const previewOpen = ref(false);
const previewRow = ref<ProjectImage | null>(null);
const previewWidth = computed(() => "min(980px, 96vw)");

const preview = (row: ProjectImage) => {
  previewRow.value = row;
  previewOpen.value = true;
};
</script>

<style scoped>
:deep(.img-head) {
  @apply bg-gray-50 dark:bg-[#0f172a] text-gray-600 dark:text-gray-300 font-semibold;
}
:deep(.el-table__header-wrapper th.el-table__cell) {
  @apply bg-gray-50 dark:bg-[#0f172a];
}
:deep(.img-row) td.el-table__cell {
  @apply border-gray-200 dark:border-gray-700;
}
:deep(.el-table__row--striped td.el-table__cell) {
  @apply dark:bg-white/5;
}
:deep(.el-table__body tr:hover > td.el-table__cell) {
  @apply bg-gray-50/60 dark:bg-white/10 transition-colors;
}

/* actions */
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
.action-view {
  @apply bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 hover:text-blue-400
         dark:bg-blue-400/10 dark:text-blue-300 dark:hover:bg-blue-400/20;
}
.action-delete {
  @apply bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:text-red-500
         dark:bg-red-400/10 dark:text-red-300 dark:hover:bg-red-400/20;
}

/* preview dialog */
.img-preview-dialog :deep(.el-dialog) {
  @apply !rounded-2xl overflow-hidden;
}
.img-preview-dialog :deep(.el-dialog__header),
.img-preview-dialog :deep(.el-dialog__footer) {
  @apply !p-0;
}
.img-preview-dialog :deep(.el-dialog__body) {
  @apply !p-0;
}
</style>
