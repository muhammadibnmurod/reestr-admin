<template>
  <div class="mb-6 flex flex-col items-center">
    <div class="relative" v-loading="uploading">
      <div class="relative group">
        <div
          class="w-[120px] h-[120px] rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-700 shadow-lg ring-2 ring-gray-200 dark:ring-gray-600 bg-gray-100 dark:bg-gray-800"
        >
          <img
            v-if="preview"
            :src="preview"
            class="w-full h-full object-cover"
            @error="onError"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800"
          >
            <el-icon :size="40" class="text-blue-400 dark:text-blue-300">
              <User />
            </el-icon>
          </div>
        </div>

        <div
          v-if="!uploading && !disabled"
          class="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer"
          @click="triggerUpload"
        >
          <el-icon :size="32" class="text-white"><Camera /></el-icon>
        </div>

        <el-button
          v-if="modelValue && !uploading && !disabled"
          circle
          type="danger"
          size="small"
          class="absolute -top-2 -right-2 shadow-lg hover:scale-110 transition-transform"
          @click="clear"
        >
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
    </div>

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

    <div v-if="!disabled" class="mt-4 text-center">
      <el-button
        type="primary"
        link
        :icon="Upload"
        @click="triggerUpload"
        :loading="uploading"
        class="text-blue-600 dark:text-blue-400"
      >
        {{ modelValue ? "Rasmni o'zgartirish" : "Rasm tanlash" }}
      </el-button>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
        JPG, PNG yoki GIF (max. 2MB)
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";
import type { UploadFile, UploadInstance } from "element-plus";
import { Camera, Close, Upload, User } from "@element-plus/icons-vue";
import api from "@/utils/axios";

const props = defineProps<{
  modelValue: string;
  initialPreview?: string;
  disabled?: boolean;
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
    preview.value = val || "";
  },
);

const triggerUpload = () => {
  uploadRef.value?.$el.querySelector('input[type="file"]')?.click();
};

const handleChange = async (file: UploadFile) => {
  if (!file.raw) return;

  if (file.raw.size > 2 * 1024 * 1024) {
    ElMessage.error("Rasm hajmi 2MB dan kichik bo'lishi kerak!");
    return;
  }

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
      throw new Error("Path not found");
    }
  } catch (error: any) {
    ElMessage.error(
      error.response?.data?.message || "Rasmni yuklashda xatolik",
    );
    preview.value = "";
    emit("update:modelValue", "");
  } finally {
    uploading.value = false;
  }
};

const clear = () => {
  preview.value = "";
  emit("update:modelValue", "");
};

const onError = () => {
  ElMessage.error("Rasmni yuklashda xatolik");
};
</script>
