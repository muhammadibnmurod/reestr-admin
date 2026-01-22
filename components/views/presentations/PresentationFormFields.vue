<template>
  <div class="space-y-6">
    <!-- Title Section -->
    <div class="border dark:border-gray-700 rounded-lg p-5 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20">
      <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <el-icon class="text-blue-600 dark:text-blue-400"><Document /></el-icon>
        Sarlavha (Title)
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <el-form-item label="O'zbekcha *" prop="titleUz" class="mb-0">
          <el-input
            v-model="modelValue.titleUz"
            placeholder="KMO-Oylik nazorat ko'rigi"
            :disabled="disabled"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="Inglizcha" prop="titleEn" class="mb-0">
          <el-input
            v-model="modelValue.titleEn"
            placeholder="KMO-Monthly Inspection"
            :disabled="disabled"
            maxlength="200"
          />
        </el-form-item>

        <el-form-item label="Ruscha" prop="titleRu" class="mb-0">
          <el-input
            v-model="modelValue.titleRu"
            placeholder="KMO-Ежемесячный контрольный осмотр"
            :disabled="disabled"
            maxlength="200"
          />
        </el-form-item>

        <el-form-item label="Kiril" prop="titleKiril" class="mb-0">
          <el-input
            v-model="modelValue.titleKiril"
            placeholder="KMO-Oйлик назорат кўриги"
            :disabled="disabled"
            maxlength="200"
          />
        </el-form-item>
      </div>
    </div>

    <!-- Subtitle Section -->
    <div class="border dark:border-gray-700 rounded-lg p-5 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20">
      <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <el-icon class="text-green-600 dark:text-green-400"><ChatLineSquare /></el-icon>
        Qo'shimcha sarlavha (Subtitle)
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <el-form-item label="O'zbekcha *" prop="subtitleUz" class="mb-0">
          <el-input
            v-model="modelValue.subtitleUz"
            placeholder="Oylik ko'riklar uchun xavfsiz va samarali nazorat"
            :disabled="disabled"
            maxlength="300"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="Inglizcha" prop="subtitleEn" class="mb-0">
          <el-input
            v-model="modelValue.subtitleEn"
            placeholder="Safe and effective monitoring"
            :disabled="disabled"
            maxlength="300"
          />
        </el-form-item>

        <el-form-item label="Ruscha" prop="subtitleRu" class="mb-0">
          <el-input
            v-model="modelValue.subtitleRu"
            placeholder="Безопасный и эффективный надзор"
            :disabled="disabled"
            maxlength="300"
          />
        </el-form-item>

        <el-form-item label="Kiril" prop="subtitleKiril" class="mb-0">
          <el-input
            v-model="modelValue.subtitleKiril"
            placeholder="Хавфсиз ва самарали назорат"
            :disabled="disabled"
            maxlength="300"
          />
        </el-form-item>
      </div>
    </div>

    <!-- Description Title Section -->
    <div class="border dark:border-gray-700 rounded-lg p-5 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20">
      <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <el-icon class="text-purple-600 dark:text-purple-400"><Memo /></el-icon>
        Tavsif sarlavhasi (Description Title)
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <el-form-item label="O'zbekcha *" prop="descriptionTitleUz" class="mb-0">
          <el-input
            v-model="modelValue.descriptionTitleUz"
            placeholder="КМО жараёнларини онлайн назорат қилиш тизими"
            :disabled="disabled"
            maxlength="300"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="Inglizcha" prop="descriptionTitleEn" class="mb-0">
          <el-input
            v-model="modelValue.descriptionTitleEn"
            placeholder="Online control system for KMO processes"
            :disabled="disabled"
            maxlength="300"
          />
        </el-form-item>

        <el-form-item label="Ruscha" prop="descriptionTitleRu" class="mb-0">
          <el-input
            v-model="modelValue.descriptionTitleRu"
            placeholder="Система онлайн-контроля процессов КМО"
            :disabled="disabled"
            maxlength="300"
          />
        </el-form-item>

        <el-form-item label="Kiril" prop="descriptionTitleKiril" class="mb-0">
          <el-input
            v-model="modelValue.descriptionTitleKiril"
            placeholder="KMO жараёнларини онлайн назорат қилиш тизими"
            :disabled="disabled"
            maxlength="300"
          />
        </el-form-item>
      </div>
    </div>

    <!-- Description Section -->
    <div class="border dark:border-gray-700 rounded-lg p-5 bg-gradient-to-br from-orange-50/50 to-amber-50/50 dark:from-orange-900/20 dark:to-amber-900/20">
      <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <el-icon class="text-orange-600 dark:text-orange-400"><Reading /></el-icon>
        Tavsif (Description)
      </h3>
      <div class="grid grid-cols-1 gap-4">
        <el-form-item label="O'zbekcha *" prop="descriptionUz" class="mb-0">
          <el-input
            v-model="modelValue.descriptionUz"
            type="textarea"
            :rows="4"
            placeholder="Temir yo'l stansiyalaridagi oylik ko'riklarni real vaqtda kuzatish va rahbariyatga monitoring imkonini beradi"
            :disabled="disabled"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <el-form-item label="Inglizcha" prop="descriptionEn" class="mb-0">
            <el-input
              v-model="modelValue.descriptionEn"
              type="textarea"
              :rows="4"
              placeholder="Allows real-time monitoring of monthly inspections at railway stations"
              :disabled="disabled"
              maxlength="1000"
            />
          </el-form-item>

          <el-form-item label="Ruscha" prop="descriptionRu" class="mb-0">
            <el-input
              v-model="modelValue.descriptionRu"
              type="textarea"
              :rows="4"
              placeholder="Позволяет в режиме реального времени отслеживать ежемесячные осмотры"
              :disabled="disabled"
              maxlength="1000"
            />
          </el-form-item>
        </div>

        <el-form-item label="Kiril" prop="descriptionKiril" class="mb-0">
          <el-input
            v-model="modelValue.descriptionKiril"
            type="textarea"
            :rows="4"
            placeholder="Темир йўл станцияларидаги ойлик кўрикларни реал вақтда кузатиш"
            :disabled="disabled"
            maxlength="1000"
          />
        </el-form-item>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Document,
  ChatLineSquare,
  Memo,
  Reading,
} from "@element-plus/icons-vue";
import type { PresentationFormData } from "@/types";

defineProps<{
  modelValue: PresentationFormData;
  disabled?: boolean;
}>();
</script>

<style scoped>
:deep(.el-form-item) {
  margin-bottom: 0;
}

:deep(.el-form-item__label) {
  @apply text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5;
}

:deep(.el-input__wrapper),
:deep(.el-textarea__inner) {
  @apply shadow-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600;
  @apply hover:border-blue-400 focus-within:border-blue-500;
  @apply transition-all duration-200;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-textarea__inner:focus) {
  @apply shadow-md ring-2 ring-blue-100 dark:ring-blue-900/50;
}

:deep(.el-input.is-disabled .el-input__wrapper),
:deep(.el-textarea.is-disabled .el-textarea__inner) {
  @apply bg-gray-100 dark:bg-gray-800/50 cursor-not-allowed;
}

/* Section hover effects */
.border:hover {
  @apply shadow-md;
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

/* Gradient backgrounds for sections */
.space-y-6 > div {
  transition: all 0.3s ease;
}
</style>