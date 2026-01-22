<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
    <el-table
      :data="presentations"
      v-loading="loading"
      stripe
      row-key="id"
      empty-text="Ma'lumot topilmadi"
      height="70vh"
      style="width: 100%"
    >
      <!-- INDEX -->
      <el-table-column
        type="index"
        width="60"
        fixed="left"
      />

      <!-- ORDER -->
      <el-table-column label="Tartib" width="80" align="center">
        <template #default="{ row }">
          <el-tag type="warning" size="small">
            {{ row.order }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- LOGO -->
<el-table-column label="Logo" width="120" class=" border-x-4" align="center">
  <template #default="{ row }">
    <div class="image-box">
      <img
        :src="getImageUrl(row.logo)"
        alt="logo"
      />
    </div>
  </template>
</el-table-column>

<!-- IMAGE -->
<el-table-column label="Rasm" width="120" align="center">
  <template #default="{ row }">
    <div class="image-box">
      <img
        :src="getImageUrl(row.image)"
        alt="image"
      />
    </div>
  </template>
</el-table-column>

      <!-- TITLE -->
      <el-table-column label="Sarlavha" min-width="320">
        <template #default="{ row }">
          <div>
            <div class="font-semibold">
              {{ row.titleUz }}
            </div>
            <div class="text-xs text-gray-500">
              {{ row.subtitleUz }}
            </div>
          </div>
        </template>
      </el-table-column>

      <!-- COLOR -->
      <el-table-column label="Rang" width="100" align="center">
        <template #default="{ row }">
          <div
            class="w-8 h-8 rounded border mx-auto"
            :style="{ backgroundColor: row.color }"
          />
        </template>
      </el-table-column>

      <!-- FEATURES -->
      <el-table-column label="Xususiyatlar" width="150" align="center">
        <template #default="{ row }">
          <el-tag type="success" size="small">
            {{ row.features?.length || 0 }} ta
          </el-tag>
        </template>
      </el-table-column>

      <!-- DATE -->
      <el-table-column label="Sana" width="180">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>

      <!-- ACTIONS (FIXED RIGHT) -->
      <el-table-column
        label="Amallar"
        width="220"
        fixed="right"
        align="center"
      >
        <template #default="{ row }">
          <div class="flex gap-1 justify-center">
            <el-button
              size="small"
              type="primary"
              circle
              @click="$emit('edit', row)"
            >
              <el-icon><Edit /></el-icon>
            </el-button>

            <el-button
              size="small"
              type="success"
              circle
              plain
              @click="$emit('view', row)"
            >
              <el-icon><View /></el-icon>
            </el-button>

            <el-button
              size="small"
              type="danger"
              circle
              plain
              @click="$emit('delete', row.id)"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>


<script setup lang="ts">
import { Edit, View, Delete } from "@element-plus/icons-vue";
import type { Presentation } from "@/types";

defineProps<{
  presentations: Presentation[];
  loading: boolean;
}>();

const getImageUrl = (path?: string) => {
  if (!path) return "";
  return path.startsWith("http")
    ? path
    : `https://reestr.das-uty.uz/api/${path}`;
};

const formatDate = (date?: string) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("uz-UZ");
};
</script>

<style scoped>
:deep(.el-table__row:hover) {
  background-color: rgba(0, 0, 0, 0.03);
}
</style>
