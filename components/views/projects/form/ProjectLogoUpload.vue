<template>
  <div class="flex items-center gap-3">
    <div class="relative" v-loading="uploading">
      <div
        class="w-20 h-20 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
      >
        <img v-if="preview" :src="preview" class="w-full h-full object-cover" />
        <div v-else class="text-xs text-gray-400">Logo</div>
      </div>

      <button
        v-if="preview && !disabled"
        type="button"
        class="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow"
        @click="clear"
      >
        ×
      </button>
    </div>

    <div class="flex flex-col">
      <el-button
        v-if="!disabled"
        type="primary"
        plain
        size="small"
        @click="trigger"
        :disabled="uploading"
      >
        {{ modelValue ? "O‘zgartirish" : "Yuklash" }}
      </el-button>

      <p class="text-xs text-gray-400 mt-1">PNG/JPG (max 5MB)</p>
    </div>

    <el-upload
      v-if="!disabled"
      ref="uploadRef"
      class="hidden"
      :auto-upload="false"
      :show-file-list="false"
      accept="image/*"
      :on-change="handleChange"
    >
      <el-button />
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import type { UploadFile, UploadInstance } from "element-plus";
import api from "@/utils/axios";

const props = defineProps<{
  modelValue: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: string): void;
}>();

const uploadRef = ref<UploadInstance>();
const uploading = ref(false);

const preview = ref("");

const imageUrl = (p: string) => {
  if (!p) return "";
  if (p.startsWith("http")) return p;
  return `https://reestr.das-uty.uz/api/${p}`;
};

watch(
  () => props.modelValue,
  (v) => {
    preview.value = v ? imageUrl(v) : "";
  },
  { immediate: true },
);

const trigger = () => {
  uploadRef.value?.$el.querySelector('input[type="file"]')?.click();
};

const handleChange = async (file: UploadFile) => {
  if (!file.raw) return;

  if (!file.raw.type.startsWith("image/")) {
    ElMessage.error("Faqat rasm yuklang");
    return;
  }

  if (file.raw.size > 5 * 1024 * 1024) {
    ElMessage.error("Max 5MB");
    return;
  }

  // preview
  const reader = new FileReader();
  reader.onload = (e) => (preview.value = e.target?.result as string);
  reader.readAsDataURL(file.raw);

  try {
    uploading.value = true;
    const formData = new FormData();
    formData.append("file", file.raw);

    const res = await api.post("/files", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const path = res.data?.data?.path || res.data?.path;
    if (!path) throw new Error("Path not found");

    emit("update:modelValue", path);
    ElMessage.success("Logo yuklandi");
  } catch (e: any) {
    ElMessage.error(e.response?.data?.message || "Upload xatolik");
    emit("update:modelValue", "");
    preview.value = "";
  } finally {
    uploading.value = false;
  }
};

const clear = () => {
  emit("update:modelValue", "");
  preview.value = "";
};
</script>
