<template>
  <el-dialog
    v-model="openModel"
    width="850px"
    destroy-on-close
    append-to-body
    class="img-upload-dialog-fixed"
    :close-on-click-modal="true"
  >
    <template #header>
      <div class="dlg-header">
        <div class="dlg-icon">
          <el-icon :size="20" class="text-white"><Plus /></el-icon>
        </div>
        <div class="flex-1">
          <h3
            class="text-xl font-bold text-gray-900 dark:text-white leading-tight"
          >
            Rasm qo‘shish
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Loyiha uchun asosiy vizual tasvirni yuklang
          </p>
        </div>
      </div>
    </template>

    <div class="dlg-body-scroll">
      <div class="card">
        <div class="card-title mb-5">
          <div class="card-ico-wrapper">
            <el-icon class="card-ico"><UploadFilled /></el-icon>
          </div>
          <div>
            <div class="ttl">Faylni tanlash</div>
            <div class="sub">PNG, JPG yoki WebP formatida (Max: 10MB)</div>
          </div>
        </div>

        <div class="upload-container">
          <el-upload
            ref="uploadRef"
            drag
            :auto-upload="false"
            :limit="1"
            :on-change="onFileChange"
            :on-exceed="onExceed"
            :file-list="fileList"
            accept="image/*"
            class="modern-drag-upload"
          >
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">
              Faylni shu yerga tashlang yoki <em>bosib tanlang</em>
            </div>
          </el-upload>
        </div>
      </div>

      <div v-if="previewUrl" class="card mt-6">
        <div class="card-title mb-4">
          <div class="card-ico-wrapper">
            <el-icon class="card-ico"><Picture /></el-icon>
          </div>
          <div>
            <div class="ttl">Ko'rinish (Preview)</div>
            <div class="sub">Yuklanadigan rasmning asl holati</div>
          </div>
        </div>

        <div class="preview-wrapper">
          <img :src="previewUrl" alt="preview" class="preview-img" />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dlg-footer">
        <el-button size="large" class="!px-8 !rounded-xl" @click="close">
          Bekor qilish
        </el-button>

        <el-button
          type="primary"
          size="large"
          class="!px-12 !rounded-xl shadow-lg"
          :loading="saving"
          :disabled="!selectedFile"
          @click="submit"
        >
          <el-icon class="mr-1"><Check /></el-icon>
          Yuklash
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { ElMessage } from "element-plus";
import type { UploadFile, UploadInstance } from "element-plus";
import { Plus, UploadFilled, Picture, Check } from "@element-plus/icons-vue";
import api from "@/utils/axios";

const props = defineProps<{
  open: boolean;
  projectId: number;
}>();

const emit = defineEmits<{
  (e: "update:open", v: boolean): void;
  (e: "uploaded"): void;
}>();

const openModel = computed({
  get: () => props.open,
  set: (v) => emit("update:open", v),
});

const uploadRef = ref<UploadInstance>();
const saving = ref(false);
const fileList = ref<UploadFile[]>([]);
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string>("");

const reset = () => {
  fileList.value = [];
  selectedFile.value = null;
  previewUrl.value = "";
  uploadRef.value?.clearFiles?.();
};

const close = () => {
  openModel.value = false;
  reset();
};

const onExceed = () => ElMessage.warning("Faqat 1 ta rasm tanlash mumkin");

const onFileChange = (file: UploadFile) => {
  const raw = file.raw as File | undefined;
  if (!raw) return;
  selectedFile.value = raw;
  fileList.value = [file];
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  previewUrl.value = URL.createObjectURL(raw);
};

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const submit = async () => {
  if (!props.projectId) return ElMessage.error("Project ID topilmadi");
  if (!selectedFile.value) return ElMessage.warning("Rasm tanlang");

  saving.value = true;
  try {
    const image = await toBase64(selectedFile.value);
    await api.post(`/project/image/${props.projectId}`, { image });
    ElMessage.success("Rasm muvaffaqiyatli yuklandi");
    emit("uploaded");
    close();
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.message || "Yuklashda xatolik");
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.img-upload-dialog-fixed :deep(.el-dialog) {
  @apply bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden;
  height: auto;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  margin: auto !important;
}

.img-upload-dialog-fixed :deep(.el-dialog__header),
.img-upload-dialog-fixed :deep(.el-dialog__footer) {
  @apply !p-0;
  flex-shrink: 0;
}

.img-upload-dialog-fixed :deep(.el-dialog__body) {
  @apply !p-0;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.dlg-header {
  @apply flex items-center gap-4 px-8 py-6 border-b border-gray-100 dark:border-gray-800;
}

.dlg-icon {
  @apply w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg;
}

.dlg-body-scroll {
  @apply px-10 py-8;
  flex: 1;
  overflow-y: auto;
}

/* Card Style */
.card {
  @apply rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 p-6;
}
.card-title {
  @apply flex items-center gap-3;
}
.card-ico-wrapper {
  @apply w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700;
}
.card-ico {
  @apply text-blue-600 dark:text-blue-400 text-lg;
}
.ttl {
  @apply text-[15px] font-bold text-gray-900 dark:text-white leading-none;
}
.sub {
  @apply text-[11px] text-gray-500 dark:text-gray-400 mt-1;
}

/* Modern Upload Style */
.modern-drag-upload :deep(.el-upload-dragger) {
  @apply !rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-all;
}
.modern-drag-upload :deep(.el-upload-dragger:hover) {
  @apply border-blue-500 bg-blue-50/30 dark:bg-blue-900/10;
}

/* Preview wrapper */
.preview-wrapper {
  @apply mt-2 inline-flex rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm;
}
.preview-img {
  @apply block max-w-full h-auto max-h-[300px] object-contain;
}

.dlg-footer {
  @apply flex items-center justify-end gap-4 px-8 py-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20;
}
</style>
