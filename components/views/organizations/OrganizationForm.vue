<template>
  <el-dialog
    v-model="dialogVisible"
    width="640px"
    append-to-body
    destroy-on-close
    :close-on-click-modal="true"
    :lock-scroll="true"
    class="modern-org-dialog"
  >
    <template #header>
      <div class="dlg-header">
        <div class="dlg-icon">
          <el-icon :size="20" class="text-white">
            <component :is="headerIcon" />
          </el-icon>
        </div>

        <div class="flex-1 pr-10">
          <h3
            class="text-lg font-bold text-gray-900 dark:text-white leading-tight"
          >
            {{ headerTitle }}
          </h3>
          <p class="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
            {{ headerSubtitle }}
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
        size="large"
        :disabled="isViewMode"
      >
        <div class="card mb-6">
          <div class="card-head">
            <div class="card-title">
              <div class="card-ico-wrapper">
                <el-icon class="card-ico"><OfficeBuilding /></el-icon>
              </div>
              <div>
                <div class="ttl">Tashkilot nomi</div>
                <div class="sub">Barcha tillarda kiriting</div>
              </div>
            </div>

            <el-tabs v-model="activeTab" class="lang-tabs" type="card">
              <el-tab-pane label="O‘zb" name="uz" />
              <el-tab-pane label="Eng" name="en" />
              <el-tab-pane label="Рус" name="ru" />
              <el-tab-pane label="Кир" name="krill" />
            </el-tabs>
          </div>

          <el-form-item :prop="`name.${activeTab}`" class="m-0">
            <el-input
              v-model="form.name[activeTab]"
              :placeholder="activePlaceholder"
              clearable
              class="modern-inp"
            />
          </el-form-item>
        </div>

        <div class="card">
          <div class="card-title mb-4">
            <div class="card-ico-wrapper">
              <el-icon class="card-ico"><Connection /></el-icon>
            </div>
            <div>
              <div class="ttl">Yuqori tashkilot</div>
              <div class="sub">Tashkilot iyerarxiyasini tanlang</div>
            </div>
          </div>

          <el-form-item prop="parentId" class="m-0">
            <el-select
              v-model="form.parentId"
              placeholder="Yuqori tashkilotni tanlang"
              clearable
              filterable
              class="w-full modern-select"
              :disabled="isViewMode"
            >
              <el-option
                v-for="org in parentOptions"
                :key="org.id"
                :value="org.id"
                :label="org.name?.[activeTab] || org.name?.uz"
              />
            </el-select>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <template #footer>
      <div class="dlg-footer">
        <el-button size="large" class="!px-6 !rounded-xl" @click="onCancel">
          {{ isViewMode ? "Yopish" : "Bekor qilish" }}
        </el-button>

        <el-button
          v-if="!isViewMode"
          type="primary"
          size="large"
          class="!px-10 !rounded-xl"
          :loading="loading"
          @click="onSubmit"
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
import api from "@/utils/axios";
import { ElMessage } from "element-plus";
import {
  Plus,
  Edit,
  View,
  OfficeBuilding,
  Connection,
  Check,
} from "@element-plus/icons-vue";

const props = defineProps<{
  open: boolean;
  isViewMode?: boolean;
  editData?: any;
  organizations: any[];
}>();

const emit = defineEmits<{
  (e: "update:open", v: boolean): void;
  (e: "save"): void;
}>();

const formRef = ref();
const loading = ref(false);
const activeTab = ref<"uz" | "en" | "ru" | "krill">("uz");

const form = reactive({
  name: { uz: "", en: "", ru: "", krill: "" },
  parentId: null as number | null,
});

const dialogVisible = computed({
  get: () => props.open,
  set: (v) => emit("update:open", v),
});

const isEdit = computed(() => !!props.editData?.id);
const isViewMode = computed(() => !!props.isViewMode);

const headerIcon = computed(() =>
  isViewMode.value ? View : isEdit.value ? Edit : Plus,
);
const headerTitle = computed(() =>
  isViewMode.value
    ? "Tashkilot ma'lumotlari"
    : isEdit.value
      ? "Tashkilotni tahrirlash"
      : "Yangi tashkilot",
);
const headerSubtitle = computed(() =>
  isViewMode.value
    ? "Iyerarxiya va nomlar ko'rinishi"
    : "Tizim iyerarxiyasi uchun yangi tashkilot qo'shing",
);

const parentOptions = computed(() => {
  const selfId = props.editData?.id;
  return (props.organizations || []).filter((o: any) => o.id !== selfId);
});

const activePlaceholder = computed(() => {
  const map = {
    uz: "Tashkilot nomi...",
    en: "Organization name...",
    ru: "Название организации...",
    krill: "Ташкилот номи...",
  };
  return map[activeTab.value];
});

const rules = {
  "name.uz": [{ required: true, message: "Majburiy", trigger: "blur" }],
  "name.en": [{ required: true, message: "Majburiy", trigger: "blur" }],
  "name.ru": [{ required: true, message: "Majburiy", trigger: "blur" }],
  "name.krill": [{ required: true, message: "Majburiy", trigger: "blur" }],
};

const resetForm = () => {
  Object.assign(form.name, { uz: "", en: "", ru: "", krill: "" });
  form.parentId = null;
  activeTab.value = "uz";
  formRef.value?.clearValidate?.();
};

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      resetForm();
      return;
    }
    if (props.editData?.id) {
      Object.assign(form.name, {
        uz: props.editData?.name?.uz || "",
        en: props.editData?.name?.en || "",
        ru: props.editData?.name?.ru || "",
        krill: props.editData?.name?.krill || "",
      });
      form.parentId = props.editData?.parentId || null;
    }
  },
  { immediate: true },
);

const onSubmit = async () => {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
    loading.value = true;
    const payload = {
      name: { ...form.name },
      parentId: form.parentId ?? 0,
    };
    if (props.editData?.id)
      await api.patch(`/organizations/${props.editData.id}`, payload);
    else await api.post("/organizations", payload);
    ElMessage.success("Muvaffaqiyatli saqlandi");
    emit("save");
    emit("update:open", false);
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.message || "Xatolik yuz berdi");
  } finally {
    loading.value = false;
  }
};

const onCancel = () => {
  emit("update:open", false);
};
</script>

<style scoped>
.modern-org-dialog :deep(.el-dialog) {
  @apply bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
}

.dlg-header {
  @apply flex items-center gap-4 px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900;
}

.dlg-icon {
  @apply w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none;
}

.dlg-body-scroll {
  @apply px-6 py-8;
  flex: 1;
  overflow-y: auto;
}

/* Card Style */
.card {
  @apply rounded-2xl border border-gray-100 dark:border-gray-800 
         bg-gray-50/50 dark:bg-gray-800/30 p-5 transition-all;
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
  @apply text-[15px] font-bold text-gray-900 dark:text-white leading-none;
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

/* Inputs & Selects */
.modern-inp :deep(.el-input__wrapper),
.modern-select :deep(.el-select__wrapper) {
  @apply !rounded-xl !shadow-none bg-white dark:bg-gray-900
         border border-gray-200 dark:border-gray-700 h-12 px-4;
}
.modern-inp :deep(.el-input__wrapper.is-focus),
.modern-select :deep(.el-select__wrapper.is-focused) {
  @apply border-blue-500 ring-4 ring-blue-500/10 !shadow-none;
}

.dlg-footer {
  @apply flex items-center justify-end gap-3 px-6 py-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20;
}

.m-0 {
  margin-bottom: 0 !important;
}
</style>
