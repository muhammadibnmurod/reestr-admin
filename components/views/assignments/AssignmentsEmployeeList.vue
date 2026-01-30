<template>
  <div class="bg-white dark:bg-[#1e222b] rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
    <el-table
      :data="employees"
      stripe
      row-key="id"
      empty-text="Xodim biriktirilmagan"
      class="w-full"
      header-cell-class-name="tbl-head"
      :row-class-name="() => 'tbl-row'"
    >
      <el-table-column type="index" label="#" width="60" />

      <!-- EMPLOYEE -->
      <el-table-column label="Xodim" min-width="340">
        <template #default="{ row }">
          <div class="flex items-center gap-3">
            <el-image
              :src="getImageUrl(row.image)"
              :preview-src-list="[getImageUrl(row.image)]"
              fit="cover"
              class="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 overflow-hidden"
              preview-teleported
            >
              <template #error>
                <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500">
                  U
                </div>
              </template>
            </el-image>

            <div class="min-w-0">
              <div class="font-semibold text-gray-900 dark:text-white truncate">
                {{ row.fullnameuz || row.fullNameUz || "-" }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {{ row.positionuz || row.positionUz || "-" }}
              </div>
            </div>
          </div>
        </template>
      </el-table-column>

      <!-- ACTIONS -->
      <el-table-column label="Amallar" width="140" align="center" fixed="right">
        <template #default="{ row }">
          <div class="flex justify-center gap-2">
            <el-tooltip v-if="!readonly" content="Olib tashlash" placement="top">
              <el-button
                circle
                plain
                type="danger"
                :icon="Delete"
                class="w-10 h-10"
                @click="$emit('unassign-employee', row.id)"
              />
            </el-tooltip>
          </div>
        </template>
      </el-table-column>

      <template #empty>
        <div class="py-10 text-center">
          <div class="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Xodimlar yo‘q
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            “Xodim qo‘shish” tugmasidan foydalaning.
          </div>
        </div>
      </template>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { Delete } from "@element-plus/icons-vue";

defineProps<{
  employees: any[];
  readonly?: boolean;
}>();

defineEmits<{
  (e: "unassign-employee", employeeId: number): void;
}>();

const getImageUrl = (path?: string) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `https://reestr.das-uty.uz/api/${path}`;
};
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
</style>
