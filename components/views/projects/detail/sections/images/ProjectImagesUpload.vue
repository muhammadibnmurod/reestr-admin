<template>
  <el-dialog
    v-model="openModel"
    :width="dialogWidth"
    destroy-on-close
    append-to-body
    class="img-upload-dialog"
    :close-on-click-modal="true"
  >
    <!-- header (qotadi) -->
    <template #header>
      <div
        class="flex items-center gap-3 px-6 py-4 border-b border-gray-200 dark:border-gray-700"
      >
        <div
          class="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg"
        >
          <el-icon :size="18" class="text-white"><Plus /></el-icon>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            Rasm qo‘shish
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Project uchun 1 ta rasm yuklang (upload qilinadi)
          </p>
        </div>
      </div>
    </template>

    <!-- body (scroll faqat shu joyda) -->
    <div class="dlg-body">
      <div
        class="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 p-5"
      >
        <el-upload
          ref="uploadRef"
          drag
          :auto-upload="false"
          :limit="1"
          :on-change="onFileChange"
          :on-exceed="onExceed"
          :file-list="fileList"
          accept="image/*"
          class="w-full"
        >
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div class="el-upload__text">
            Faylni shu yerga tashlang yoki <em>bosib tanlang</em>
          </div>
          <template #tip>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              PNG/JPG/WebP. Maksimal: 10MB (backend limitiga bog‘liq).
            </div>
          </template>
        </el-upload>
      </div>

      <!-- preview -->
      <div v-if="previewUrl" class="mt-5">
        <div class="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Preview
        </div>

        <!-- rasm o'z proporsiyasida: w/h ni rasmning o'zi belgilaydi -->
        <div
          class="inline-flex rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          <img :src="previewUrl" alt="preview" class="block max-w-full h-auto" />
        </div>
      </div>

      <!-- note -->
      <!-- <div class="mt-5 text-xs text-gray-500 dark:text-gray-400">
        Eslatma: agar sizga bir nechta rasm kerak bo‘lsa, limitni oshiramiz.
      </div> -->
    </div>

    <!-- footer (qotadi) -->
    <template #footer>
      <div
        class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
      >
        <el-button class="!rounded-xl" size="large" @click="close">
          Bekor qilish
        </el-button>

        <el-button
          type="primary"
          class="!rounded-xl !px-8"
          size="large"
          :loading="saving"
          :disabled="!selectedFile"
          @click="submit"
        >
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
import { Plus, UploadFilled } from "@element-plus/icons-vue";
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

const dialogWidth = computed(() => "min(860px, 96vw)");

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

const onExceed = () => {
  ElMessage.warning("Faqat 1 ta rasm tanlash mumkin");
};

const onFileChange = (file: UploadFile) => {
  // element-plus UploadFile -> raw file
  const raw = file.raw as File | undefined;
  if (!raw) return;

  selectedFile.value = raw;
  fileList.value = [file];

  // preview
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
  if (!props.projectId) {
    ElMessage.error("projectId topilmadi");
    return;
  }
  if (!selectedFile.value) {
    ElMessage.warning("Rasm tanlang");
    return;
  }

  saving.value = true;
  try {
    const image = await toBase64(selectedFile.value);
    await api.post(`/project/image/${props.projectId}`, { image });

    ElMessage.success("Rasm yuklandi");
    emit("uploaded");
    close();
  } catch (e: any) {
    const message = e?.response?.data?.message;
    if (message && Array.isArray(message)) {
      ElMessage.error(message.join(", "));
    } else {
      ElMessage.error(message || "Yuklashda xatolik");
    }
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.img-upload-dialog :deep(.el-dialog) {
  @apply !rounded-2xl overflow-hidden;
  display: flex;
  flex-direction: column;
  max-height: 80vh; 
}

.img-upload-dialog :deep(.el-dialog__header),
.img-upload-dialog :deep(.el-dialog__footer) {
  @apply !p-0;
  flex-shrink: 0;
}

.img-upload-dialog :deep(.el-dialog__body) {
  @apply !p-0;
  flex: 1;
  min-height: 0;
  overflow: hidden; /* modal scroll OFF */
  display: flex;
  flex-direction: column;
}

/* body scroll */
.dlg-body {
  @apply px-6 py-5;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}
</style>
