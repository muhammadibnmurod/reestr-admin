<template>
  <el-dialog
    v-model="openModel"
    width="650px"
    destroy-on-close
    append-to-body
    class="cat-dialog"
  >
    <template #header>
      <div class="hdr">
        <div class="icn">
          <el-icon :size="20" class="text-white">
            <component :is="isViewMode ? View : isEditMode ? Edit : Plus" />
          </el-icon>
        </div>
        <div class="flex-1">
          <h3
            class="text-lg font-bold text-gray-900 dark:text-white leading-tight"
          >
            {{ title }}
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {{ subtitle }}
          </p>
        </div>
      </div>
    </template>

    <div class="body">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <div class="card">
          <div class="card-head">
            <div class="card-title">
              <div class="card-ico-wrapper">
                <el-icon class="card-ico"><Document /></el-icon>
              </div>
              <div>
                <div class="ttl">Kategoriya nomi</div>
                <div class="sub">Turli tillarda kiriting</div>
              </div>
            </div>

            <el-tabs v-model="tab" class="lang-tabs" type="card">
              <el-tab-pane label="O‘zb" name="uz" />
              <el-tab-pane label="Eng" name="en" />
              <el-tab-pane label="Рус" name="ru" />
              <el-tab-pane label="Кир" name="kr" />
            </el-tabs>
          </div>

          <el-form-item :prop="activeProp" class="m-0">
            <el-input
              v-model="activeValue"
              :placeholder="activePlaceholder"
              :disabled="isViewMode"
              clearable
              class="modern-inp"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>

    <template #footer>
      <div class="ftr">
        <el-button size="large" class="!rounded-xl" @click="openModel = false">
          {{ isViewMode ? "Yopish" : "Bekor qilish" }}
        </el-button>

        <el-button
          v-if="!isViewMode"
          type="primary"
          size="large"
          class="!rounded-xl !px-10"
          :loading="saving"
          @click="submit"
        >
          <el-icon class="mr-1"><Check /></el-icon>
          Saqlash
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import type { FormInstance } from "element-plus";
import { ElMessage } from "element-plus";
import { Plus, Edit, View, Document, Check } from "@element-plus/icons-vue";
import api from "@/utils/axios";

const props = defineProps<{
  open: boolean;
  isEditMode?: boolean;
  isViewMode?: boolean;
  editData?: any | null;
}>();

const emit = defineEmits<{
  (e: "update:open", v: boolean): void;
  (e: "saved"): void;
}>();

const openModel = computed({
  get: () => props.open,
  set: (v) => emit("update:open", v),
});

const isEditMode = computed(() => !!props.isEditMode && !!props.editData?.id);
const isViewMode = computed(() => !!props.isViewMode);

const title = computed(() =>
  isViewMode.value
    ? "Kategoriya ma'lumotlari"
    : isEditMode.value
      ? "Kategoriyani tahrirlash"
      : "Yangi kategoriya qo'shish",
);
const subtitle = computed(() =>
  isViewMode.value
    ? "Barcha tillardagi nomlar"
    : "Tizim uchun yangi hujjat turini yarating",
);

const formRef = ref<FormInstance>();
const saving = ref(false);
const tab = ref<"uz" | "en" | "ru" | "kr">("uz");

const form = reactive({
  id: 0,
  nameUz: "",
  nameRu: "",
  nameEn: "",
  nameKiril: "",
});

const rules = {
  nameUz: [
    { required: true, message: "Nomini kiritish majburiy", trigger: "blur" },
  ],
};

// --- Dinamik Input Boshqaruvi ---
const activeProp = computed(() => {
  const map = { uz: "nameUz", en: "nameEn", ru: "nameRu", kr: "nameKiril" };
  return map[tab.value];
});

const activeValue = computed({
  get: () => form[activeProp.value as keyof typeof form] as string,
  set: (val) => {
    (form[activeProp.value as keyof typeof form] as any) = val;
  },
});

const activePlaceholder = computed(() => {
  const map = {
    uz: "Masalan: Shartnoma",
    en: "e.g. Contract",
    ru: "Например: Договор",
    kr: "Масалан: Шартнома",
  };
  return map[tab.value];
});

const reset = () => {
  form.id = 0;
  form.nameUz = "";
  form.nameRu = "";
  form.nameEn = "";
  form.nameKiril = "";
  tab.value = "uz";
  formRef.value?.clearValidate();
};

watch(
  () => props.open,
  (v) => {
    if (!v) return;
    if (props.editData?.id) {
      Object.assign(form, props.editData);
    } else {
      reset();
    }
  },
);

const submit = async () => {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
    saving.value = true;
    const { id, ...payload } = form;
    if (isEditMode.value) {
      await api.put("/document-category", form);
      ElMessage.success("Muvaffaqiyatli yangilandi");
    } else {
      await api.post("/document-category", payload);
      ElMessage.success("Muvaffaqiyatli yaratildi");
    }
    emit("saved");
    openModel.value = false;
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.message || "Xatolik yuz berdi");
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.cat-dialog :deep(.el-dialog) {
  @apply bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden;
  margin: auto !important;
}

.cat-dialog :deep(.el-dialog__header),
.cat-dialog :deep(.el-dialog__footer) {
  @apply !p-0;
}

.hdr {
  @apply flex items-center gap-4 px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900;
}

.icn {
  @apply w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-200 dark:shadow-none;
}

.body {
  @apply px-6 py-8;
}

/* Card Style */
.card {
  @apply rounded-2xl border border-gray-100 dark:border-gray-800 
         bg-gray-50/50 dark:bg-gray-800/30 p-5;
}

.card-head {
  @apply flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5;
}

.card-title {
  @apply flex items-center gap-3;
}

.card-ico-wrapper {
  @apply w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center 
         shadow-sm border border-gray-100 dark:border-gray-700;
}

.card-ico {
  @apply text-blue-600 dark:text-blue-400 text-lg;
}

.ttl {
  @apply text-sm font-bold text-gray-900 dark:text-white leading-none;
}

.sub {
  @apply text-[11px] text-gray-500 dark:text-gray-400 mt-1;
}

/* Segmented Tabs */
.lang-tabs :deep(.el-tabs__header) {
  @apply m-0 border-none;
}
.lang-tabs :deep(.el-tabs__nav) {
  @apply border-none bg-gray-200/50 dark:bg-gray-900 rounded-xl p-1;
}
.lang-tabs :deep(.el-tabs__item) {
  @apply !h-7 !leading-7 text-[11px] font-bold rounded-lg px-3 border-none transition-all;
  @apply text-gray-500 dark:text-gray-400;
}
.lang-tabs :deep(.el-tabs__item.is-active) {
  @apply bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm;
}

/* Modern Input */
.modern-inp :deep(.el-input__wrapper) {
  @apply !rounded-xl !shadow-none bg-white dark:bg-gray-900
         border border-gray-200 dark:border-gray-700 h-12 px-4;
}
.modern-inp :deep(.el-input__wrapper.is-focus) {
  @apply border-blue-500 ring-4 ring-blue-500/10;
}

.ftr {
  @apply flex items-center justify-end gap-3 px-6 py-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20;
}

.m-0 {
  margin-bottom: 0 !important;
}
</style>
