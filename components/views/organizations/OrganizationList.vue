<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
    <el-table
      :data="organizations"
      v-loading="loading"
      stripe
      style="width: 100%"
      header-cell-class-name="bg-gray-50 dark:bg-gray-700 font-bold text-gray-700 dark:text-gray-200"
    >
      <el-table-column type="index" width="80" label="#" align="center" />

      <el-table-column label="Organization Nomi" min-width="250" class="!py-10">
        <template #default="{ row }" class="!py-10 dark:text-white">
            {{ useGetTranslation(row.name) }}
        </template>
      </el-table-column>

      <el-table-column label="Amallar" width="150" align="center">
        <template #default="{ row }">
          <div class="flex justify-center gap-2">
            <el-tooltip content="Ko'rish" placement="top">
              <el-button
                type="primary"
                :icon="View"
                circle
                size="small"
                plain
                @click="$emit('view', row)"
              />
            </el-tooltip>

            <el-tooltip content="Tahrirlash" placement="top">
              <el-button
                type="warning"
                :icon="Edit"
                circle
                size="small"
                plain
                class="w-10 h-10"
                @click="$emit('edit', row)"
              />
            </el-tooltip>

            <el-tooltip content="O'chirish" placement="top">
              <el-button
                type="danger"
                :icon="Delete"
                circle
                size="small"
                plain
                @click="$emit('delete', row.id)"
              />
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { View, Edit, Delete } from "@element-plus/icons-vue";

defineProps<{
  organizations: any[];
  loading: boolean;
}>();

defineEmits(["view", "edit", "delete"]);
</script>
