<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full">
    <div class="flex-1 min-h-0">
      <el-table
        :data="items"
        v-loading="loading"
        stripe
        height="100%"
        class="w-full"
      >
        <el-table-column type="index" label="#" width="60" />
        <el-table-column label="Nomi" min-width="260">
          <template #default="{ row }">
            <div class="font-semibold text-gray-900 dark:text-white">
              {{ row.nameUz || "-" }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ row.nameEn || row.nameRu || row.nameKiril || "" }}
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="Status" width="140" />

      <el-table-column label="Muddat" width="280">
        <template #default="{ row }">
          <div class="flex flex-col">
            <span class="text-sm text-gray-800 dark:text-gray-200">
              {{ formatDate(row.startDate) }} → {{ formatDate(row.endDate) }}
            </span>
            <span class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {{ getDuration(row.startDate, row.endDate) }}
            </span>
          </div>
        </template>
      </el-table-column>

        <el-table-column label="Amallar" width="160" fixed="right" align="center">
          <template #default="{ row }">
            <div class="flex items-center justify-center gap-2">
              <el-tooltip content="Tahrirlash" placement="top">
                <el-button
                  circle
                  plain
                  type="warning"
                  :icon="Edit"
                  @click="$emit('edit', row)"
                />
              </el-tooltip>

              <el-tooltip content="O‘chirish" placement="top">
                <el-button
                  circle
                  plain
                  type="danger"
                  :icon="Delete"
                  @click="$emit('delete', row)"
                />
              </el-tooltip>
            </div>
          </template>
        </el-table-column>

        <template #empty>
          <div class="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
            Ma’lumot yo‘q
          </div>
        </template>
      </el-table>
    </div>

    <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
      <el-pagination
        v-model:current-page="pageModel"
        v-model:page-size="sizeModel"
        :page-sizes="[10, 20, 50]"
        :total="total"
        layout="total, sizes, prev, pager, next"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Edit, Delete } from "@element-plus/icons-vue";

const props = defineProps<{
  items: any[];
  loading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
}>();

const formatDate = (date?: string) => {
  if (!date) return "-"

  const d = new Date(date)
  return d.toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}


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

const emit = defineEmits([
  "page-change",
  "size-change",
  "edit",
  "delete",
]);

const pageModel = computed({
  get: () => props.currentPage,
  set: (v) => emit("page-change", v),
});

const sizeModel = computed({
  get: () => props.pageSize,
  set: (v) => emit("size-change", v),
});
</script>
