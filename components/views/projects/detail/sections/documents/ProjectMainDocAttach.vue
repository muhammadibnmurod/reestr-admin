<template>
  <el-dialog
    v-model="openModel"
    width="850px"
    destroy-on-close
    append-to-body
    class="doc-upload-dialog-fixed"
  >
    <template #header>
      <div class="dlg-header">
        <div class="dlg-icon">
          <el-icon :size="20" class="text-white"><Link /></el-icon>
        </div>
        <div class="flex-1">
          <h3
            class="text-xl font-bold text-gray-900 dark:text-white leading-tight"
          >
            Fayl biriktirish (Main)
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ docTitle }}
          </p>
        </div>
      </div>
    </template>

    <div class="dlg-body-scroll">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <div class="card">
          <div class="card-title mb-5">
            <div class="card-ico-wrapper">
              <el-icon class="card-ico"><UploadFilled /></el-icon>
            </div>
            <div>
              <div class="ttl">Faylni tanlang</div>
              <div class="sub">Max: 20MB</div>
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
          :loading="loading"
          @click="submit"
        >
          <el-icon class="mr-1"><Check /></el-icon>
          Biriktirish
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import {
  ElMessage,
  type FormInstance,
  type FormRules,
  type UploadFile,
  type UploadInstance,
} from "element-plus";
import { UploadFilled, Link, Check } from "@element-plus/icons-vue";
import api from "@/utils/axios";

const props = defineProps<{
  open: boolean;
  projectId: number;
  doc: any | null; // main doc row
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
  file: null as File | null,
});

const rules = reactive<FormRules>({
  file: [{ required: true, message: "Faylni tanlang", trigger: "change" }],
});

const docTitle = computed(() => {
  const d = props.doc;
  return d ? d.nameUz || d.nameEn || d.nameRu || d.nameKiril || `#${d.id}` : "";
});

const reset = () => {
  form.file = null;
  fileList.value = [];
  uploadRef.value?.clearFiles();
  formRef.value?.clearValidate();
};

watch(
  () => props.open,
  (v) => {
    if (!v) reset();
  },
);

const close = () => {
  openModel.value = false;
  reset();
};

const onFileChange = (file: UploadFile) => {
  const raw = file.raw;
  if (!raw) return;

  const maxMB = 20;
  if (raw.size / 1024 / 1024 > maxMB) {
    ElMessage.error(`Fayl ${maxMB}MB dan katta bo‘lmasin`);
    uploadRef.value?.clearFiles();
    fileList.value = [];
    form.file = null;
    return;
  }

  form.file = raw;
  fileList.value = [file];
};

const onExceed = () => ElMessage.warning("Faqat 1 ta fayl yuklash mumkin");

const submit = async () => {
  if (!props.doc?.id) return ElMessage.warning("Document topilmadi");
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    loading.value = true;
    try {
      // 1) upload file
      const fd = new FormData();
      fd.append("file", form.file as Blob);

      const fileRes = await api.post("/files", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const filePath = fileRes.data?.data?.path || fileRes.data?.data;
      if (!filePath) throw new Error("filePath not returned");

      await api.put(`/document/update/${props.doc.id}`, {
        categoryId: props.doc.categoryId ?? props.doc.category?.id ?? null,
        nameUz: props.doc.nameUz || "",
        nameRu: props.doc.nameRu || "",
        nameEn: props.doc.nameEn || "",
        nameKiril: props.doc.nameKiril || "",
        file: filePath,
      });

      ElMessage.success("Fayl biriktirildi");
      emit("uploaded");
      close();
    } catch (e: any) {
      ElMessage.error(e?.response?.data?.message || "Biriktirishda xatolik");
    } finally {
      loading.value = false;
    }
  });
};
</script>

<style scoped>
/* xuddi Upload modal dizayni */
.doc-upload-dialog-fixed :deep(.el-dialog) {
  @apply bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden;
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
.modern-drag-upload :deep(.el-upload-dragger) {
  @apply !rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-all;
}
.modern-drag-upload :deep(.el-upload-dragger:hover) {
  @apply border-blue-500 bg-blue-50/30 dark:bg-blue-900/10;
}
.dlg-footer {
  @apply flex items-center justify-end gap-4 px-8 py-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20;
}
.m-0 {
  margin-bottom: 0 !important;
}
</style>
