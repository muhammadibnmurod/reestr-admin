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
            Hujjat yuklash (Extra)
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Extra hujjatni kategoriya bilan birga yuklang
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
        <!-- CATEGORY -->
        <div class="card mb-6">
          <div class="card-title mb-5">
            <div class="card-ico-wrapper">
              <el-icon class="card-ico"><CollectionTag /></el-icon>
            </div>
            <div>
              <div class="ttl">Kategoriya</div>
              <div class="sub">Document category tanlang</div>
            </div>
          </div>

          <el-form-item label="Kategoriya" prop="categoryId" class="m-0">
            <el-select
              v-model="form.categoryId"
              filterable
              clearable
              class="w-full"
              :loading="catLoading"
              placeholder="Kategoriya tanlang"
            >
              <el-option
                v-for="c in categories"
                :key="c.id"
                :label="catLabel(c)"
                :value="c.id"
              />
            </el-select>
          </el-form-item>
        </div>

        <!-- NAMES (tabs) -->
        <div class="card mb-6">
          <div class="card-title mb-5">
            <div class="card-ico-wrapper">
              <el-icon class="card-ico"><Document /></el-icon>
            </div>
            <div>
              <div class="ttl">Hujjat nomi</div>
              <div class="sub">4 ta tilda nom kiriting (UZ majburiy)</div>
            </div>
          </div>

          <el-tabs v-model="tab" type="card" class="mb-3">
            <el-tab-pane label="O‘zbekcha" name="uz" />
            <el-tab-pane label="English" name="en" />
            <el-tab-pane label="Русский" name="ru" />
            <el-tab-pane label="Кирилл" name="kr" />
          </el-tabs>

          <el-form-item
            v-show="tab === 'uz'"
            label="Nomi (UZ) *"
            prop="nameUz"
            class="m-0"
          >
            <el-input
              v-model="form.nameUz"
              placeholder="Masalan: Texnik topshiriq"
              clearable
              class="modern-inp"
            />
          </el-form-item>

          <el-form-item
            v-show="tab === 'en'"
            label="Name (EN)"
            prop="nameEn"
            class="m-0"
          >
            <el-input
              v-model="form.nameEn"
              placeholder="For example: Contract"
              clearable
              class="modern-inp"
            />
          </el-form-item>

          <el-form-item
            v-show="tab === 'ru'"
            label="Название (RU)"
            prop="nameRu"
            class="m-0"
          >
            <el-input
              v-model="form.nameRu"
              placeholder="Например: Договор"
              clearable
              class="modern-inp"
            />
          </el-form-item>

          <el-form-item
            v-show="tab === 'kr'"
            label="Номи (Кирилл)"
            prop="nameKiril"
            class="m-0"
          >
            <el-input
              v-model="form.nameKiril"
              placeholder="Масалан: Шартнома"
              clearable
              class="modern-inp"
            />
          </el-form-item>
        </div>

        <!-- FILE -->
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
          :loading="loading"
          @click="submit"
        >
          <el-icon class="mr-1"><Check /></el-icon>
          Saqlash va Yuklash
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, onMounted } from "vue";
import {
  ElMessage,
  type FormInstance,
  type FormRules,
  type UploadFile,
  type UploadInstance,
} from "element-plus";
import {
  UploadFilled,
  Plus,
  Document,
  Check,
  CollectionTag,
} from "@element-plus/icons-vue";
import api from "@/utils/axios";

const props = defineProps<{ open: boolean; projectId: number }>();
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

const tab = ref<"uz" | "en" | "ru" | "kr">("uz");

const categories = ref<any[]>([]);
const catLoading = ref(false);

const form = reactive({
  categoryId: null as number | null,
  nameUz: "",
  nameEn: "",
  nameRu: "",
  nameKiril: "",
  file: null as File | null,
});

const rules = reactive<FormRules>({
  categoryId: [
    { required: true, message: "Kategoriya tanlang", trigger: "change" },
  ],
  nameUz: [
    { required: true, message: "Hujjat nomi (UZ) majburiy", trigger: "blur" },
  ],
  file: [{ required: true, message: "Faylni tanlang", trigger: "change" }],
});

const reset = () => {
  form.categoryId = null;
  form.nameUz = "";
  form.nameEn = "";
  form.nameRu = "";
  form.nameKiril = "";
  form.file = null;
  tab.value = "uz";
  fileList.value = [];
  uploadRef.value?.clearFiles();
  formRef.value?.clearValidate();
};

watch(
  () => props.open,
  async (v) => {
    if (!v) {
      reset();
      return;
    }
    // modal ochilganda category yo‘q bo‘lsa yuklab qo‘yamiz
    if (!categories.value.length) await fetchCategories();
  },
);

const close = () => {
  openModel.value = false;
  reset();
};

const fetchCategories = async () => {
  catLoading.value = true;
  try {
    const res = await api.get("/document-category");
    categories.value = res.data?.data ?? [];
  } catch {
    categories.value = [];
  } finally {
    catLoading.value = false;
  }
};

onMounted(fetchCategories);

const catLabel = (c: any) =>
  c?.nameUz || c?.nameEn || c?.nameRu || c?.nameKiril || `#${c?.id}`;

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
    if (!valid) return;

    loading.value = true;
    try {
      // 1) upload file -> /files
      const fd = new FormData();
      fd.append("file", form.file as Blob);
      const fileRes = await api.post("/files", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const filePath = fileRes.data?.data?.path || fileRes.data?.data;
      if (!filePath) throw new Error("filePath not returned");

      // 2) extra create -> /document/extra
      await api.post("/document/extra", {
        projectId: props.projectId,
        categoryId: form.categoryId,
        file: filePath,
        nameUz: form.nameUz,
        nameEn: form.nameEn,
        nameRu: form.nameRu,
        nameKiril: form.nameKiril,
      });

      ElMessage.success("Hujjat muvaffaqiyatli yuklandi");
      emit("uploaded");
      close();
    } catch (e: any) {
      ElMessage.error(e?.response?.data?.message || "Yuklashda xatolik");
    } finally {
      loading.value = false;
    }
  });
};
</script>

<style scoped>
/* sizdagi dizayn */
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
.modern-inp :deep(.el-input__wrapper) {
  @apply !rounded-xl !shadow-none bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 h-12 px-4 transition-all;
}
.modern-inp :deep(.el-input__wrapper.is-focus) {
  @apply border-blue-500 ring-4 ring-blue-500/10;
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
