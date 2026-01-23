<template>
  <div class="list-shell">
    <!-- TABLE SCROLL AREA -->
    <div class="table-area">
      <el-table
        :data="employees"
        v-loading="loading"
        stripe
        class="w-full"
        :empty-text="$t('common.noData')"
        height="100%"
      >
        <el-table-column type="index" width="60" label="#" />

        <el-table-column label="Rasm" width="100">
          <template #default="{ row }">
            <div class="flex items-center justify-center">
              <el-image
                style="width: 50px; height: 50px; border-radius: 50%"
                :src="getImageUrl(row.image)"
                :preview-src-list="[getImageUrl(row.image)]"
                fit="cover"
                preview-teleported
                class="border-2 border-gray-200 cursor-pointer"
              >
                <template #error>
                  <div
                    class="flex h-full w-full items-center justify-center bg-gray-100 text-gray-500"
                  >
                    {{ row.fullNameUz?.charAt(0) }}
                  </div>
                </template>
              </el-image>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="fullNameUz" label="F.I.O" min-width="200">
          <template #default="{ row }">
            <div class="font-medium text-gray-900 dark:text-white">
              {{ row.fullNameUz }}
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="positionUz" label="Lavozim" min-width="180">
          <template #default="{ row }">
            <el-tag type="info" size="small">
              {{ row.positionUz }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Yaratilgan sana" width="150">
          <template #default="{ row }">
            <div class="text-gray-600 dark:text-gray-400 text-sm">
              {{ formatDate(row.createdAt) }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Manager ID" width="120" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.managerId" size="small" type="success">
              {{ row.managerId }}
            </el-tag>
            <span v-else class="text-gray-400">-</span>
          </template>
        </el-table-column>

        <el-table-column
          label="Amallar"
          width="180"
          fixed="right"
          align="center"
        >
          <template #default="{ row }">
            <div class="flex gap-2 justify-center">
              <el-tooltip content="Tahrirlash" placement="top">
                <el-button
                  type="primary"
                  size="small"
                  :icon="Edit"
                  circle
                  class="!w-9 !h-9 shadow-sm hover:shadow-md"
                  @click="$emit('edit', row)"
                />
              </el-tooltip>

              <el-tooltip content="Ko'rish" placement="top">
                <el-button
                  type="info"
                  size="small"
                  :icon="View"
                  circle
                  plain
                  class="!w-9 !h-9 shadow-sm hover:shadow-md"
                  @click="$emit('view', row)"
                />
              </el-tooltip>

              <el-tooltip content="O'chirish" placement="top">
                <el-button
                  type="danger"
                  size="small"
                  :icon="Delete"
                  circle
                  plain
                  class="!w-9 !h-9 shadow-sm hover:shadow-md"
                  @click="$emit('delete', row.id)"
                />
              </el-tooltip>
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

    <!-- STICKY FOOTER / PAGINATION -->
    <div class="list-footer">
      <div class="text-sm text-gray-600 dark:text-gray-400">
        Jami: {{ total }} ta yozuv
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
  return `https://reestr.das-uty.uz/api/${imagePath}`;
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const handleSizeChange = (size: number) => {
  emit("size-change", size);
};

const handleCurrentChange = (page: number) => {
  emit("page-change", page);
};
</script>

<style scoped>
/* Overall card */
.list-shell {
  @apply bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden
         border border-gray-100 dark:border-gray-700
         flex flex-col;
  height: calc(100vh - 280px); /* kerak bo'lsa o'zgartirasiz */
}

/* Only table body scroll area */
.table-area {
  @apply flex-1 min-h-0; /* MUHIM: scroll ishlashi uchun */
}

/* Header styling (sticky bo'lishi uchun el-table height=100% bo'ldi) */
:deep(.el-table__header-wrapper) {
  @apply sticky top-0 z-10;
}

/* Footer fixed (card ichida qotib turadi) */
.list-footer {
  @apply flex items-center justify-between gap-3 p-4
         border-t border-gray-200 dark:border-gray-700
         bg-white/90 dark:bg-gray-800/90 backdrop-blur;
}
</style>

