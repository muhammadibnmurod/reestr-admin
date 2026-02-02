<template>
  <el-dialog
    v-model="openModel"
    width="860px"
    destroy-on-close
    append-to-body
    class="module-dialog-fixed"
    :close-on-click-modal="true"
  >
    <template #header>
      <div class="dlg-header">
        <div class="dlg-icon">
          <el-icon :size="20" class="text-white">
            <component :is="editData?.id ? Edit : Plus" />
          </el-icon>
        </div>
        <div class="flex-1">
          <h3
            class="text-xl font-bold text-gray-900 dark:text-white leading-tight"
          >
            {{ editData?.id ? "Modulni tahrirlash" : "Yangi modul qo'shish" }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Modul nomi, tavsifi, muddati va rangini belgilang
          </p>
        </div>
      </div>
    </template>

    <div class="dlg-body-scroll">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <div class="card mb-6">
          <div class="card-head">
            <div class="card-title">
              <div class="card-ico-wrapper">
                <el-icon class="card-ico"><Collection /></el-icon>
              </div>
              <div>
                <div class="ttl">Modul ma'lumotlari</div>
                <div class="sub">Turli tillarda nom va tavsif</div>
              </div>
            </div>

            <el-tabs v-model="tab" class="lang-tabs" type="card">
              <el-tab-pane label="O‘zb" name="uz" />
              <el-tab-pane label="Eng" name="en" />
              <el-tab-pane label="Рус" name="ru" />
              <el-tab-pane label="Кир" name="kr" />
            </el-tabs>
          </div>

          <div class="space-y-4">
            <el-form-item :label="activeNameLabel" :prop="activeNameProp">
              <el-input
                v-model="form[activeNameProp]"
                :placeholder="activeNamePlaceholder"
                clearable
                class="modern-inp"
              />
            </el-form-item>

            <el-form-item :label="activeDescLabel" :prop="activeDescProp">
              <el-input
                v-model="form[activeDescProp]"
                type="textarea"
                :rows="3"
                :placeholder="activeDescPlaceholder"
                class="modern-textarea"
              />
            </el-form-item>
          </div>
        </div>

        <div class="flex flex-col gap-6">
          <div class="card">
            <div class="card-title mb-5">
              <div class="card-ico-wrapper">
                <el-icon class="card-ico"><Calendar /></el-icon>
              </div>
              <div>
                <div class="ttl">Muddatlar</div>
                <div class="sub">Boshlanish va tugash sanasi</div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <el-form-item label="Start date" prop="startDate" class="m-0">
                <el-date-picker
                  v-model="form.startDate"
                  type="date"
                  value-format="YYYY-MM-DD"
                  placeholder="Sana"
                  class="!w-full modern-date"
                />
              </el-form-item>
              <el-form-item label="End date" prop="endDate" class="m-0">
                <el-date-picker
                  v-model="form.endDate"
                  type="date"
                  value-format="YYYY-MM-DD"
                  placeholder="Sana"
                  class="!w-full modern-date"
                />
              </el-form-item>
            </div>
          </div>

          <div class="card">
            <div class="card-title mb-5">
              <div class="card-ico-wrapper">
                <el-icon class="card-ico"><Brush /></el-icon>
              </div>
              <div>
                <div class="ttl">Vizual identifikatsiya</div>
                <div class="sub">Modul uchun rang tanlang</div>
              </div>
            </div>
            <el-form-item prop="color" class="m-0">
              <PresentationColorPicker v-model="form.color" />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>

    <template #footer>
      <div class="dlg-footer">
        <el-button
          class="!rounded-xl !px-8"
          size="large"
          @click="openModel = false"
        >
          Bekor qilish
        </el-button>
        <el-button
          type="primary"
          class="!rounded-xl !px-12 shadow-lg"
          size="large"
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
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
import {
  Plus,
  Edit,
  Collection,
  Calendar,
  Brush,
  Check,
} from "@element-plus/icons-vue";
import api from "@/utils/axios";

const props = defineProps<{
  open: boolean;
  projectId: number;
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

const formRef = ref<FormInstance>();
const saving = ref(false);
const tab = ref<"uz" | "en" | "ru" | "kr">("uz");

const form = reactive<any>({
  nameUz: "",
  nameRu: "",
  nameEn: "",
  nameKiril: "",
  descriptionUz: "",
  descriptionRu: "",
  descriptionEn: "",
  descriptionKiril: "",
  startDate: "",
  endDate: "",
  color: "yellow",
});

// --- Dinamik prop va label mantiqlari ---
const activeNameProp = computed(() => {
  const map: any = {
    uz: "nameUz",
    en: "nameEn",
    ru: "nameRu",
    kr: "nameKiril",
  };
  return map[tab.value];
});
const activeDescProp = computed(() => {
  const map: any = {
    uz: "descriptionUz",
    en: "descriptionEn",
    ru: "descriptionRu",
    kr: "descriptionKiril",
  };
  return map[tab.value];
});

const activeNameLabel = computed(
  () => `Modul nomi (${tab.value.toUpperCase()})`,
);
const activeDescLabel = computed(() => `Tavsif (${tab.value.toUpperCase()})`);

const activeNamePlaceholder = computed(
  () =>
    ({
      uz: "Masalan: Auth modul",
      en: "e.g. Auth module",
      ru: "Например: Модуль авторизации",
      kr: "Масалан: Аутх модул",
    })[tab.value],
);

const activeDescPlaceholder = computed(
  () => "Modul haqida qisqacha ma'lumot...",
);

const rules = {
  nameUz: [{ required: true, message: "Majburiy", trigger: "blur" }],
  descriptionUz: [{ required: true, message: "Majburiy", trigger: "blur" }],
  startDate: [{ required: true, message: "Majburiy", trigger: "change" }],
  endDate: [{ required: true, message: "Majburiy", trigger: "change" }],
  color: [{ required: true, message: "Majburiy", trigger: "change" }],
};

const reset = () => {
  Object.keys(form).forEach(
    (key) => (form[key] = key === "color" ? "yellow" : ""),
  );
  tab.value = "uz";
  formRef.value?.clearValidate();
};

watch(
  () => props.open,
  (v) => {
    if (!v) return;
    if (props.editData?.id) Object.assign(form, props.editData);
    else reset();
  },
);

const submit = async () => {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
    saving.value = true;
    const payload = { projectId: props.projectId, ...form };
    if (props.editData?.id)
      await api.put(`/module/${props.editData.id}`, payload);
    else await api.post("/module", payload);
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
.module-dialog-fixed :deep(.el-dialog) {
  @apply bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden;
  height: 85vh;
  display: flex;
  flex-direction: column;
  margin: auto !important;
}

.module-dialog-fixed :deep(.el-dialog__header),
.module-dialog-fixed :deep(.el-dialog__footer) {
  @apply !p-0;
  flex-shrink: 0;
}

.module-dialog-fixed :deep(.el-dialog__body) {
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
  @apply rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 p-5;
}
.card-head {
  @apply flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5;
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
  @apply text-sm font-bold text-gray-900 dark:text-white leading-none;
}
.sub {
  @apply text-[11px] text-gray-500 dark:text-gray-400 mt-1;
}

/* Tabs */
.lang-tabs :deep(.el-tabs__header) {
  @apply m-0 border-none;
}
.lang-tabs :deep(.el-tabs__nav) {
  @apply border-none bg-gray-200/50 dark:bg-gray-900 rounded-xl p-1;
}
.lang-tabs :deep(.el-tabs__item) {
  @apply !h-7 !leading-7 text-[11px] font-bold rounded-lg px-3 border-none transition-all text-gray-500;
}
.lang-tabs :deep(.el-tabs__item.is-active) {
  @apply bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm;
}

/* Input Dizayni (1ga 1) */
.modern-inp :deep(.el-input__wrapper),
.modern-date :deep(.el-input__wrapper),
.modern-textarea :deep(.el-textarea__inner) {
  @apply !rounded-xl !shadow-none bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 h-12 px-4 transition-all;
}
.modern-textarea :deep(.el-textarea__inner) {
  @apply py-3 h-auto;
}

.modern-inp :deep(.el-input__wrapper.is-focus),
.modern-date :deep(.el-input__wrapper.is-focus),
.modern-textarea :deep(.el-textarea__inner:focus) {
  @apply border-blue-500 ring-4 ring-blue-500/10;
}

:deep(.el-form-item__label) {
  @apply text-sm font-bold text-gray-900 dark:text-white leading-none mb-2 ml-1;
}

.dlg-footer {
  @apply flex items-center justify-end gap-4 px-8 py-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20;
}
.m-0 {
  margin-bottom: 0 !important;
}
</style>
