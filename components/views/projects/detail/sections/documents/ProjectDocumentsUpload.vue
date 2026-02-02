<template>
  <el-dialog
    v-model="openModel"
    width="850px"
    destroy-on-close
    append-to-body
    class="doc-upload-dialog-fixed"
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
            Hujjat yuklash
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Loyiha uchun qo'shimcha hujjat va fayllarni tizimga biriktiring
          </p>
        </div>
      </div>
    </template>

    <div class="dlg-body-scroll">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent
      >
        <div class="card mb-6">
          <div class="card-title mb-5">
            <div class="card-ico-wrapper">
              <el-icon class="card-ico"><Document /></el-icon>
            </div>
            <div>
              <div class="ttl">Hujjat ma'lumotlari</div>
              <div class="sub">Hujjat nomi va tavsiflovchi sarlavha</div>
            </div>
          </div>

          <el-form-item label="Hujjat nomi" prop="nameUz" class="m-0">
            <el-input
              v-model="form.nameUz"
              placeholder="Masalan: Texnik topshiriq yoki Shartnoma"
              class="modern-inp"
              clearable
            />
          </el-form-item>
        </div>

        <div class="card">
          <div class="card-title mb-5">
            <div class="card-ico-wrapper">
              <el-icon class="card-ico"><UploadFilled /></el-icon>
            </div>
            <div>
              <div class="ttl">Faylni biriktirish</div>
              <div class="sub">PDF, DOCX, XLSX yoki rasmlar (Max: 20MB)</div>
            </div>
          </div>

          <el-form-item prop="file" class="m-0">
            <el-upload
              ref="uploadRef"
              drag
              :auto-upload="false"
              :limit="1"
              :on-change="onFileChange"
              :on-exceed="onExceed"
              :file-list="fileList"
              class="modern-drag-upload w-full"
            >
              <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
              <div class="el-upload__text">
                Faylni shu yerga tashlang yoki <em>bosib tanlang</em>
              </div>
            </el-upload>
          </el-form-item>
        </div>
      </el-form>
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
          @click="submit"
          :loading="loading"
        >
          <el-icon class="mr-1"><Check /></el-icon>
          Saqlash va Yuklash
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from "vue";
import {
  ElMessage,
  type FormInstance,
  type FormRules,
  type UploadFile,
  type UploadInstance,
} from "element-plus";
import { UploadFilled, Plus, Document, Check } from "@element-plus/icons-vue";
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

const loading = ref(false);
const formRef = ref<FormInstance>();
const uploadRef = ref<UploadInstance>();
const fileList = ref<UploadFile[]>([]);

const form = reactive({
  nameUz: "",
  file: null as File | null,
});

const rules = reactive<FormRules>({
  nameUz: [
    { required: true, message: "Hujjat nomini kiriting", trigger: "blur" },
  ],
  file: [{ required: true, message: "Faylni tanlang", trigger: "change" }],
});

const reset = () => {
  form.nameUz = "";
  form.file = null;
  fileList.value = [];
  uploadRef.value?.clearFiles();
};

const close = () => {
  openModel.value = false;
  reset();
};

const onFileChange = (file: UploadFile) => {
  const rawFile = file.raw;
  if (!rawFile) return;

  const maxMB = 20;
  if (rawFile.size / 1024 / 1024 > maxMB) {
    ElMessage.error(`Fayl hajmi ${maxMB}MB dan katta bo‘lmasin`);
    uploadRef.value?.clearFiles();
    fileList.value = [];
    form.file = null;
    return;
  }

  form.file = rawFile;
  fileList.value = [file];
};

const onExceed = () => ElMessage.warning("Faqat 1 ta fayl yuklash mumkin");

const submit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        const formData = new FormData();
        formData.append("file", form.file as Blob);

        const fileRes = await api.post("/files", formData);
        const filePath = fileRes.data?.data?.path || fileRes.data?.data;

        await api.post(`/document/extra`, {
          nameUz: form.nameUz,
          file: filePath,
          projectId: props.projectId,
        });

        ElMessage.success("Hujjat muvaffaqiyatli yuklandi");
        emit("uploaded");
        close();
      } catch (e: any) {
        ElMessage.error(e?.response?.data?.message || "Yuklashda xatolik");
      } finally {
        loading.value = false;
      }
    }
  });
};
</script>

<style scoped>
.doc-upload-dialog-fixed :deep(.el-dialog) {
  @apply bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden;
  height: auto;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  margin: auto !important;
}

.doc-upload-dialog-fixed :deep(.el-dialog__header),
.doc-upload-dialog-fixed :deep(.el-dialog__footer) {
  @apply !p-0;
  flex-shrink: 0;
}

.doc-upload-dialog-fixed :deep(.el-dialog__body) {
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

/* Input Dizayni (1ga 1) */
.modern-inp :deep(.el-input__wrapper) {
  @apply !rounded-xl !shadow-none bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 h-12 px-4 transition-all;
}
.modern-inp :deep(.el-input__wrapper.is-focus) {
  @apply border-blue-500 ring-4 ring-blue-500/10;
}

/* Drag upload style */
.modern-drag-upload :deep(.el-upload-dragger) {
  @apply !rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-all;
}
.modern-drag-upload :deep(.el-upload-dragger:hover) {
  @apply border-blue-500 bg-blue-50/30 dark:bg-blue-900/10;
}

:deep(.el-form-item__label) {
  @apply text-sm font-bold text-gray-900 dark:text-white leading-none mb-3 ml-1;
}

.dlg-footer {
  @apply flex items-center justify-end gap-4 px-8 py-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20;
}
.m-0 {
  margin-bottom: 0 !important;
}
</style>
