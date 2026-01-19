<template>
  <el-table :data="data" stripe class="user-table h-full">
    <el-table-column label="№" width="70" align="center">
      <template #default="scope">
        {{ (page - 1) * size + scope.$index + 1 }}
      </template>
    </el-table-column>

    <el-table-column label="Foydalanuvchi" min-width="200">
      <template #default="{ row }">
        <div class="flex items-center gap-3 py-1">
          <AppAvatar :src="row.image" :name="row.fullName" :size="45" />
          <div class="flex flex-col">
            <span class="font-bold text-slate-900 dark:text-white leading-none">
              {{ row.fullName || "N/A" }}
            </span>
            <span class="text-xs text-slate-500 mt-1">@{{ row.username }}</span>
          </div>
        </div>
      </template>
    </el-table-column>

    <el-table-column label="Roli" width="120" align="center">
      <template #default="{ row }">
        <el-tag :type="row.role === 'admin' ? 'danger' : 'success'" round>
          {{ row.role }}
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column label="Amallar" width="120" align="center" fixed="right">
      <template #default="{ row }">
        <div class="flex gap-2">
          <el-button
            :icon="ElIconKey"
            circle
            size="small"
            @click="$emit('resetPassword', row)"
          />
          <el-button
            :icon="ElIconDelete"
            circle
            size="small"
            type="danger"
            @click="handleDelete(row)"
          />
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
// Element Plus ikonkalari
import {
  Delete as ElIconDelete,
  Key as ElIconKey,
} from "@element-plus/icons-vue";

// Props turlarini belgilaymiz
interface Props {
  data: any[]; // Jadval ma'lumotlari
  page?: number; // Hozirgi sahifa (default: 1)
  size?: number; // Sahifa hajmi (default: 10)
}

// Propslarni qabul qilish (default qiymatlar bilan)
const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  page: 1,
  size: 10,
});

// Emits - tashqariga yuboriladigan hodisalar
const emit = defineEmits<{
  (e: "delete", id: string | number): void;
  (e: "resetPassword", row: any): void;
}>();

/**
 * Foydalanuvchini o'chirish tugmasi bosilganda
 * row ichidan ID ni topib emit qiladi
 */
const handleDelete = (row: any) => {
  const userId = row.id || row._id; // Backend formatiga qarab id yoki _id
  if (userId) {
    emit("delete", userId);
  } else {
    console.error("User ID topilmadi!", row);
  }
};
</script>
