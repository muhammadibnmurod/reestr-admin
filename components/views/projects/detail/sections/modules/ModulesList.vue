<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
  >
    <el-table
      :data="modules"
      v-loading="loading"
      stripe
      style="width: 100%"
      header-cell-class-name="bg-gray-50 dark:bg-gray-700 font-semibold text-gray-700 dark:text-gray-200"
      :row-class-name="
        () => 'hover:bg-gray-50/60 dark:hover:bg-gray-700/40 transition-colors'
      "
    >
      <el-table-column type="index" width="60" label="#" align="center" />

      <el-table-column label="Modul nomi" min-width="280">
        <template #default="{ row }">
          <div class="flex flex-col">
            <span class="font-semibold text-gray-900 dark:text-gray-100">
              {{
                row.nameUz || row.nameEn || row.nameRu || row.nameKiril || "-"
              }}
            </span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Muddat" width="220">
        <template #default="{ row }">
          <span class="text-sm text-gray-700 dark:text-gray-200">
            {{ row.startDate || "-" }} → {{ row.endDate || "-" }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="Rang" width="120" align="center">
        <template #default="{ row }">
          <div
            class="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 mx-auto"
            :style="{ backgroundColor: row.color || '#e5e7eb' }"
          />
        </template>
      </el-table-column>

      <el-table-column label="Amallar" width="220" align="center" fixed="right">
        <template #default="{ row }">
          <div class="flex justify-center gap-2">
            <el-button
              size="small"
              class="!rounded-xl"
              @click="$emit('view-submodules', row)"
            >
              Submodules
            </el-button>

            <el-tooltip v-if="!readonly" content="Tahrirlash" placement="top">
              <el-button
                type="warning"
                :icon="Edit"
                circle
                size="small"
                plain
                @click="$emit('edit', row)"
              />
            </el-tooltip>

            <el-tooltip v-if="!readonly" content="O‘chirish" placement="top">
              <el-button
                type="danger"
                :icon="Delete"
                circle
                size="small"
                plain
                @click="$emit('delete', row)"
              />
            </el-tooltip>
          </div>
        </template>
      </el-table-column>

      <template #empty>
        <div class="py-10 text-center">
          <div class="text-sm text-gray-700 dark:text-gray-200 font-semibold">
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

defineProps<{
  modules: any[];
  loading?: boolean;
  readonly?: boolean;
}>();

defineEmits(["edit", "delete", "view-submodules"]);
</script>
