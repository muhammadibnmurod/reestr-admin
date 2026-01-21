<script setup lang="ts">
import { Edit, Delete } from "@element-plus/icons-vue";

defineProps<{
  data: any[];
}>();

const emit = defineEmits(["delete", "edit"]);

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return "";
  // Backend dan to'liq URL kelsa
  if (imagePath.startsWith("http")) return imagePath;
  // Relative path kelsa
  return `https://reestr.das-uty.uz/${imagePath}`;
};

const getStatusColor = (status: string) => {
  return status === "Active" ? "#10b981" : "#ef4444";
};
</script>

<template>
  <div class="users-table-wrapper">
    <el-table
      :data="data"
      style="width: 100%"
      :header-cell-style="{
        background: '#f9fafb',
        color: '#6b7280',
        fontSize: '14px',
        fontWeight: '500',
      }"
    >
      <!-- Checkbox Column -->
      <el-table-column type="selection" width="55" />

      <!-- Full Name with Avatar -->
      <el-table-column label="Full name" min-width="200">
        <template #header>
          <div class="flex items-center gap-2">
            <i class="el-icon-user text-gray-500" />
            <span>Full name</span>
          </div>
        </template>
        <template #default="scope">
          <div class="flex items-center gap-3">
            <el-avatar :size="40" :src="getImageUrl(scope.row.image)">
              {{ scope.row.fullName?.charAt(0) }}
              {{ console.log("Scope row image",scope.row.image) }}
            </el-avatar>
            <span class="font-medium text-gray-900 dark:text-white">
              {{ scope.row.fullName }}
            </span>
          </div>
        </template>
      </el-table-column>

      <!-- Role -->
      <el-table-column label="Role" width="180">
        <template #header>
          <div class="flex items-center gap-2">
            <i class="el-icon-user text-gray-500" />
            <span>Role</span>
          </div>
        </template>
        <template #default="scope">
          <span class="text-gray-700 dark:text-gray-300">
            {{ scope.row.role }}
          </span>
        </template>
      </el-table-column>
      <!-- Actions -->
      <el-table-column label="Actions" width="150" fixed="right">
        <template #header>
          <div class="flex items-center gap-2">
            <i class="el-icon-setting text-gray-500" />
            <span>Actions</span>
          </div>
        </template>
        <template #default="scope">
          <div class="flex items-center gap-2">
            <el-button
              size="small"
              :icon="Edit"
              @click="$emit('edit', scope.row)"
              link
              class="!text-gray-600 hover:!text-blue-600"
            >
              Edit
            </el-button>

            <el-popconfirm
              title="Are you sure to delete this user?"
              confirm-button-text="Yes"
              cancel-button-text="No"
              @confirm="$emit('delete', scope.row.id)"
            >
              <template #reference>
                <el-button
                  size="small"
                  :icon="Delete"
                  link
                  class="!text-gray-600 hover:!text-red-600"
                >
                  Delete
                </el-button>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.users-table-wrapper {
  @apply bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700;
}

:deep(.el-table) {
  @apply bg-transparent;
}

:deep(.el-table__header-wrapper) {
  @apply bg-gray-50 dark:bg-gray-900;
}

:deep(.el-table th.el-table__cell) {
  @apply bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 font-medium;
}

:deep(.el-table tr) {
  @apply bg-white dark:bg-gray-800;
}

:deep(.el-table tbody tr:hover > td) {
  @apply bg-gray-50 dark:bg-gray-700/50;
}

:deep(.el-table td.el-table__cell) {
  @apply border-gray-200 dark:border-gray-700;
}

:deep(.cell) {
  @apply text-gray-900 dark:text-white;
}
</style>
