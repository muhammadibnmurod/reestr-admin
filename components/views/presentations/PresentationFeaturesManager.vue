<template>
  <div class="features-manager">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <el-icon><Grid /></el-icon>
          Xususiyatlar
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Taqdimot xususiyatlarini boshqarish
        </p>
      </div>
      <el-button
        v-if="!disabled"
        type="primary"
        :icon="Plus"
        @click="addFeature"
        size="default"
      >
        Xususiyat qo'shish
      </el-button>
    </div>

    <!-- Features List -->
    <div v-if="modelValue.length > 0" class="space-y-4">
      <div
        v-for="(feature, index) in modelValue"
        :key="index"
        class="feature-card border dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800/50 hover:shadow-md transition-all"
      >
        <!-- Feature Header -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div
              class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900 flex items-center justify-center"
            >
              <span class="text-blue-600 dark:text-blue-400 font-bold">
                {{ index + 1 }}
              </span>
            </div>
            <span class="font-semibold text-gray-700 dark:text-gray-300">
              Xususiyat {{ feature.order }}
            </span>
          </div>
          
          <div class="flex items-center gap-2">
            <!-- Move Up -->
            <el-tooltip content="Yuqoriga" placement="top">
              <el-button
                v-if="!disabled"
                type="info"
                size="small"
                circle
                plain
                :disabled="index === 0"
                @click="moveUp(index)"
              >
                <el-icon><CaretTop /></el-icon>
              </el-button>
            </el-tooltip>

            <!-- Move Down -->
            <el-tooltip content="Pastga" placement="top">
              <el-button
                v-if="!disabled"
                type="info"
                size="small"
                circle
                plain
                :disabled="index === modelValue.length - 1"
                @click="moveDown(index)"
              >
                <el-icon><CaretBottom /></el-icon>
              </el-button>
            </el-tooltip>

            <!-- Delete -->
            <el-tooltip content="O'chirish" placement="top">
              <el-button
                v-if="!disabled"
                type="danger"
                size="small"
                :icon="Delete"
                circle
                plain
                @click="removeFeature(index)"
              />
            </el-tooltip>
          </div>
        </div>

        <!-- Icon Upload -->
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Ikonka *
          </label>
          <PresentationImageUpload
            v-model="feature.icon"
            :initial-preview="feature.icon"
            :disabled="disabled"
            upload-type="icon"
            :compact="true"
          />
        </div>

        <!-- Feature Fields -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Title Uz -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sarlavha (O'zbekcha) *
            </label>
            <el-input
              v-model="feature.titleUz"
              placeholder="Sarlavha"
              :disabled="disabled"
              maxlength="100"
              show-word-limit
            />
          </div>

          <!-- Title En -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sarlavha (Inglizcha)
            </label>
            <el-input
              v-model="feature.titleEn"
              placeholder="Title"
              :disabled="disabled"
              maxlength="100"
            />
          </div>

          <!-- Title Ru -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sarlavha (Ruscha)
            </label>
            <el-input
              v-model="feature.titleRu"
              placeholder="Заголовок"
              :disabled="disabled"
              maxlength="100"
            />
          </div>

          <!-- Title Kiril -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sarlavha (Kiril)
            </label>
            <el-input
              v-model="feature.titleKiril"
              placeholder="Сарлавҳа"
              :disabled="disabled"
              maxlength="100"
            />
          </div>

          <!-- Description Uz -->
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tavsif (O'zbekcha) *
            </label>
            <el-input
              v-model="feature.descriptionUz"
              type="textarea"
              :rows="3"
              placeholder="Tavsif"
              :disabled="disabled"
              maxlength="500"
              show-word-limit
            />
          </div>

          <!-- Description En -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tavsif (Inglizcha)
            </label>
            <el-input
              v-model="feature.descriptionEn"
              type="textarea"
              :rows="2"
              placeholder="Description"
              :disabled="disabled"
              maxlength="500"
            />
          </div>

          <!-- Description Ru -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tavsif (Ruscha)
            </label>
            <el-input
              v-model="feature.descriptionRu"
              type="textarea"
              :rows="2"
              placeholder="Описание"
              :disabled="disabled"
              maxlength="500"
            />
          </div>

          <!-- Description Kiril -->
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tavsif (Kiril)
            </label>
            <el-input
              v-model="feature.descriptionKiril"
              type="textarea"
              :rows="2"
              placeholder="Тавсиф"
              :disabled="disabled"
              maxlength="500"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800/30"
    >
      <el-icon :size="48" class="text-gray-400 mb-4"><Grid /></el-icon>
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        Hozircha xususiyatlar yo'q
      </p>
      <el-button
        v-if="!disabled"
        type="primary"
        :icon="Plus"
        @click="addFeature"
      >
        Birinchi xususiyatni qo'shish
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, Delete, Grid, CaretTop, CaretBottom } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import type { Feature } from "@/types";
import PresentationImageUpload from "./PresentationImageUpload.vue";

const props = defineProps<{
  modelValue: Feature[];
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Feature[]): void;
}>();

const addFeature = () => {
  const newFeature: Feature = {
    titleUz: "",
    titleRu: "",
    titleEn: "",
    titleKiril: "",
    descriptionUz: "",
    descriptionRu: "",
    descriptionEn: "",
    descriptionKiril: "",
    icon: "",
    order: props.modelValue.length + 1,
  };

  emit("update:modelValue", [...props.modelValue, newFeature]);
  
  ElMessage.success("Yangi xususiyat qo'shildi");
};

const removeFeature = (index: number) => {
  const newFeatures = [...props.modelValue];
  newFeatures.splice(index, 1);
  
  // Update order
  newFeatures.forEach((feature, idx) => {
    feature.order = idx + 1;
  });
  
  emit("update:modelValue", newFeatures);
  ElMessage.success("Xususiyat o'chirildi");
};

const moveUp = (index: number) => {
  if (index === 0) return;
  
  const newFeatures = [...props.modelValue];
  [newFeatures[index], newFeatures[index - 1]] = [
    newFeatures[index - 1],
    newFeatures[index],
  ];
  
  // Update order
  newFeatures.forEach((feature, idx) => {
    feature.order = idx + 1;
  });
  
  emit("update:modelValue", newFeatures);
};

const moveDown = (index: number) => {
  if (index === props.modelValue.length - 1) return;
  
  const newFeatures = [...props.modelValue];
  [newFeatures[index], newFeatures[index + 1]] = [
    newFeatures[index + 1],
    newFeatures[index],
  ];
  
  // Update order
  newFeatures.forEach((feature, idx) => {
    feature.order = idx + 1;
  });
  
  emit("update:modelValue", newFeatures);
};
</script>

<style scoped>
.features-manager {
  @apply border-t border-gray-200 dark:border-gray-700 pt-6;
}

.feature-card {
  position: relative;
  transition: all 0.3s ease;
}

.feature-card:hover {
  @apply shadow-lg;
  transform: translateY(-2px);
}

:deep(.el-input__wrapper),
:deep(.el-textarea__inner) {
  @apply transition-all duration-200;
}

:deep(.el-input__wrapper:hover),
:deep(.el-textarea__inner:hover) {
  @apply border-blue-300 dark:border-blue-600;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-textarea__inner:focus) {
  @apply shadow-md ring-2 ring-blue-100 dark:ring-blue-900/50;
}
</style>