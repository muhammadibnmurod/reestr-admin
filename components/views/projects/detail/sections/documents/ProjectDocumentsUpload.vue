<template>
  <el-dialog
    v-model="openModel"
    width="640px"
    destroy-on-close
    append-to-body
    class="doc-upload-dialog"
  >
    <template #header>
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="text-lg font-bold text-gray-900 dark:text-white">
          Document yuklash
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Fayl tanlang va yuklang
        </div>
      </div>
    </template>

    <div class="px-6 py-5">
      <el-form @submit.prevent="submit" ref="formRef" :model="form" :rules="rules">
        <el-form-item label="Hujjat nomi" prop="nameUz">
          <el-input v-model="form.nameUz" placeholder="Hujjat nomini kiriting"></el-input>
        </el-form-item>
        
        <el-form-item label="Fayl" prop="file">
          <el-upload
            ref="uploadRef"
            class="w-full"
            drag
            :auto-upload="false"
            :limit="1"
            :on-change="onFileChange"
            :on-exceed="onExceed"
            :file-list="fileList"
          >
            <el-icon class="text-2xl"><UploadFilled /></el-icon>
            <div class="el-upload__text">
              Faylni tashlang yoki <em>bosib tanlang</em>
            </div>
            <template #tip>
              <div class="text-xs text-gray-500 mt-2">
                PDF, DOCX, XLSX, PNG, JPG (max 20MB)
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
        <el-button class="!rounded-xl" @click="close">Bekor qilish</el-button>
        <el-button type="primary" class="!rounded-xl" @click="submit" :loading="loading">
          Saqlash va Yuklash
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from "vue";
import { ElMessage, type FormInstance, type FormRules, type UploadFile, type UploadInstance } from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";
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
  nameUz: [{ required: true, message: "Hujjat nomini kiriting", trigger: "blur" }],
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
    ElMessage.error(`Fayl ${maxMB}MB dan katta bo‘lmasin`);
    uploadRef.value?.clearFiles();
    fileList.value = [];
    form.file = null;
    return;
  }
  
  form.file = rawFile;
  fileList.value = [file];
};

const onExceed = () => {
  ElMessage.warning("Faqat 1 ta fayl tanlash mumkin");
};

const submit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        // Step 1: Upload file to /api/files
        const formData = new FormData();
        formData.append("file", form.file as Blob);
        
        const fileRes = await api.post("/files", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const filePath = fileRes.data?.data?.path || fileRes.data?.data; 
        if (!filePath) {
          throw new Error("File path not found in response from /api/files");
        }

        // Step 2: Create extra document record
        await api.post(`/document/extra`, {
          nameUz: form.nameUz,
          file: filePath,
          projectId: props.projectId,
        });

        ElMessage.success("Hujjat muvaffaqiyatli yuklandi");
        emit("uploaded");
        close();
      } catch (e: any) {
        const message = e?.response?.data?.message;
        const errorMessage = Array.isArray(message) ? message.join(", ") : message;
        ElMessage.error(errorMessage || "Yuklashda xatolik");
      } finally {
        loading.value = false;
      }
    }
  });
};
</script>

<style scoped>
.doc-upload-dialog :deep(.el-dialog) {
  @apply !rounded-2xl overflow-hidden;
}
.doc-upload-dialog :deep(.el-dialog__header),
.doc-upload-dialog :deep(.el-dialog__footer) {
  @apply !p-0;
}
.doc-upload-dialog :deep(.el-dialog__body) {
  @apply !p-0;
}
</style>