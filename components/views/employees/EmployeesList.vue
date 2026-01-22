<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
    <el-table
      :data="employees"
      v-loading="loading"
      stripe
      class="w-full"
      :empty-text="$t('common.noData')"
    >
      <el-table-column type="index" width="60" label="#" />

      <el-table-column label="Rasm" width="100">
        <template #default="{ row }">
          <el-avatar
            :size="50"
            :src="getImageUrl(row.image)"
            class="border-2 border-gray-200"
          >
            {{ row.fullNameUz?.charAt(0) }}
          </el-avatar>
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

      <el-table-column label="Amallar" width="180" fixed="right" align="center">
        <template #default="{ row }">
          <div class="flex gap-2 justify-center">
            <el-tooltip content="Tahrirlash" placement="top">
              <el-button
                type="primary"
                size="small"
                :icon="Edit"
                circle
                class="!w-9 !h-9  transition-transform shadow-sm hover:shadow-md"
                @click="$emit('edit', row)"
              />
            </el-tooltip>
            <el-tooltip content="Ko'rish" placement="top">
              <el-button
                type="info"
                size="small"
                circle
                plain
                class="!w-9 !h-9  transition-transform shadow-sm hover:shadow-md"
                @click="$emit('view', row)"
              >
                <el-icon><View /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="O'chirish" placement="top">
              <el-button
                type="danger"
                size="small"
                :icon="Delete"
                circle
                plain
                class="!w-9 !h-9  transition-transform shadow-sm hover:shadow-md"
                @click="$emit('delete', row.id)"
              />
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div
      class="flex justify-between items-center p-4 border-t dark:border-gray-700"
    >
      <div class="text-sm text-gray-600 dark:text-gray-400">
        Jami: {{ total }} ta yozuv
      </div>
      <el-pagination
        v-model:current-page="currentPageModel"
        v-model:page-size="pageSizeModel"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
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
