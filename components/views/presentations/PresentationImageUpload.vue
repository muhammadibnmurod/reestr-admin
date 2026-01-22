<template>
  <div :class="['image-upload-container', { compact: compact }]">
    <div class="relative" v-loading="uploading">
      <div class="relative group">
        <!-- Preview Container -->
        <div
          :class="[
            'preview-container overflow-hidden bg-gray-100 dark:bg-gray-800',
            uploadType === 'logo' ? 'w-32 h-32 rounded-2xl' : 
            uploadType === 'icon' ? 'w-20 h-20 rounded-xl' : 
            'w-full h-48 rounded-xl'
          ]"
        >
          <!-- Image Preview -->
          <img
            v-if="preview"
            :src="preview"
            :class="[
              'w-full h-full object-cover',
              uploadType === 'icon' ? 'p-2' : ''
            ]"
            @error="onError"
          />
          
          <!-- Empty State -->
          <div
            v-else
            class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30"
          >
            <el-icon
              :size="uploadType === 'icon' ? 24 : uploadType === 'logo' ? 32 : 48"
              class="text-blue-400 dark:text-blue-300 mb-2"
            >
              <Picture v-if="uploadType === 'image'" />
              <Avatar v-else-if="uploadType === 'logo'" />
              <StarFilled v-else />
            </el-icon>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ getPlaceholderText() }}
            </span>
          </div>
        </div>

        <!-- Hover Overlay -->
        <div
          v-if="!uploading && !disabled"
          :class="[
            'absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer',
            uploadType === 'logo' ? 'rounded-2xl' : 
            uploadType === 'icon' ? 'rounded-xl' : 
            'rounded-xl'
          ]"
          @click="triggerUpload"
        >
          <el-icon :size="uploadType === 'icon' ? 20 : 28" class="text-white">
            <Camera />
          </el-icon>
        </div>

        <!-- Delete Button -->
        <el-button
          v-if="modelValue && !uploading && !disabled"
          circle
          type="danger"
          size="small"
          class="absolute -top-2 -right-2 shadow-lg hover:scale-110 transition-transform z-10"
          @click="clear"
        >
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- Upload Input -->
    <el-upload
      v-if="!disabled"
      ref="uploadRef"
      :auto-upload="false"
      :show-file-list="false"
      accept="image/*"
      :on-change="handleChange"
      class="hidden"
    >
      <el-button />
    </el-upload>

    <!-- Upload Button & Info -->
    <div v-if="!disabled && !compact" class="mt-3 text-center">
      <el-button
        type="primary"
        link
        :icon="Upload"
        @click="triggerUpload"
        :loading="uploading"
        class=""
        size="small"
      >
        {{ modelValue ? "Rasmni o'zgartirish" : "Rasm tanlash" }}
      </el-button>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {{ getInfoText() }}
      </p>
    </div>

    <!-- Compact Mode Button -->
    <div v-if="!disabled && compact" class="mt-2">
      <el-button
        type="primary"
        plain
        size="small"
        :icon="Upload"
        @click="triggerUpload"
        :loading="uploading"
        class="w-full"
      >
        {{ modelValue ? "O'zgartirish" : "Yuklash" }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";
import type { UploadFile, UploadInstance } from "element-plus";
import {
  Camera,
  Close,
  Upload,
  Picture,
  Avatar,
  StarFilled,
} from "@element-plus/icons-vue";
import api from "@/utils/axios";

const props = defineProps<{
  modelValue: string;
  initialPreview?: string;
  disabled?: boolean;
  uploadType?: "logo" | "image" | "icon"; // logo, image (banner), icon
  compact?: boolean; // Compact mode for features
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const uploadRef = ref<UploadInstance>();
const uploading = ref(false);
const preview = ref(props.initialPreview || "");

watch(
  () => props.initialPreview,
  (val) => {
    if (val) {
      // Check if URL or path
      if (val.startsWith('http')) {
        preview.value = val;
      } else {
        preview.value = `https://reestr.das-uty.uz/${val}`;
      }
    } else {
      preview.value = "";
    }
  },
  { immediate: true }
);

watch(
  () => props.modelValue,
  (val) => {
    if (val && !preview.value) {
      if (val.startsWith('http')) {
        preview.value = val;
      } else {
        preview.value = `https://reestr.das-uty.uz/${val}`;
      }
    }
  }
);

const getPlaceholderText = () => {
  switch (props.uploadType) {
    case "logo":
      return "Logo";
    case "icon":
      return "Icon";
    default:
      return "Rasm";
  }
};

const getInfoText = () => {
  const maxSize = props.uploadType === "icon" ? "1MB" : "2MB";
  return `JPG, PNG yoki SVG (max. ${maxSize})`;
};

const getMaxSize = () => {
  return props.uploadType === "icon" ? 1 : 2;
};

const triggerUpload = () => {
  uploadRef.value?.$el.querySelector('input[type="file"]')?.click();
};

const handleChange = async (file: UploadFile) => {
  if (!file.raw) return;

  const maxSize = getMaxSize() * 1024 * 1024;
  
  if (file.raw.size > maxSize) {
    ElMessage.error(`Rasm hajmi ${getMaxSize()}MB dan kichik bo'lishi kerak!`);
    return;
  }

  // Validate image type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
  if (!allowedTypes.includes(file.raw.type)) {
    ElMessage.error("Faqat JPG, PNG, GIF yoki SVG formatidagi rasmlar qo'llab-quvvatlanadi!");
    return;
  }

  // Show preview immediately
  const reader = new FileReader();
  reader.onload = (e) => {
    preview.value = e.target?.result as string;
  };
  reader.readAsDataURL(file.raw);

  try {
    uploading.value = true;
    const formData = new FormData();
    formData.append("file", file.raw);

    const res = await api.post("/files", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const uploadedPath = res.data?.data?.path || res.data?.path;
    if (uploadedPath) {
      emit("update:modelValue", uploadedPath);
      ElMessage.success("Rasm muvaffaqiyatli yuklandi");
    } else {
      throw new Error("Path not found in response");
    }
  } catch (error: any) {
    console.error("Upload error:", error);
    ElMessage.error(
      error.response?.data?.message || "Rasmni yuklashda xatolik yuz berdi"
    );
    preview.value = props.initialPreview || "";
    emit("update:modelValue", "");
  } finally {
    uploading.value = false;
  }
};

const clear = () => {
  preview.value = "";
  emit("update:modelValue", "");
  ElMessage.info("Rasm o'chirildi");
};

const onError = () => {
  console.error("Image load error");
  preview.value = "";
};
</script>

<style scoped>
.image-upload-container {
  @apply relative;
}

.image-upload-container.compact {
  @apply inline-block;
}

.preview-container {
  @apply border-4 border-gray-200 dark:border-gray-700 shadow-lg;
  transition: all 0.3s ease;
}

.preview-container:hover {
  @apply border-blue-300 dark:border-blue-600 shadow-xl;
}

:deep(.el-loading-mask) {
  @apply rounded-xl;
}

.group:hover .preview-container {
  @apply scale-[1.02];
}
</style>