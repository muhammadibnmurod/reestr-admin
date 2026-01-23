<template>
  <el-dialog
    v-model="dialogVisible"
    width="600px"
    align-center
    append-to-body
    destroy-on-close
    :close-on-click-modal="true"
    :lock-scroll="true"
    class="modern-org-dialog"
  >
    <!-- ✅ HEADER (QOTADI) -->
    <template #header>
      <div class="dlg-header">
        <div class="dlg-icon">
          <el-icon :size="20" class="text-white">
            <component :is="isViewMode ? View : editData?.id ? Edit : Plus" />
          </el-icon>
        </div>

        <div class="flex-1">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">
            {{
              isViewMode
                ? "Organization ma'lumotlari"
                : editData?.id
                  ? "Tahrirlash"
                  : "Yangi Organization"
            }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{
              isViewMode
                ? "Tashkilot haqida ma'lumot"
                : editData?.id
                  ? "Tashkilotni tahrirlash"
                  : "Yangi tashkilot qo‘shish"
            }}
          </p>
        </div>
      </div>
    </template>

    <!-- ✅ BODY (faqat shu joy scroll) -->
    <div class="dlg-body-scroll">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        :disabled="isViewMode"
      >
        <el-tabs v-model="activeTab" class="mb-4">
          <el-tab-pane label="O'zbekcha" name="uz">
            <el-form-item label="Name (UZ)" prop="name.uz">
              <el-input
                v-model="form.name.uz"
                placeholder="Nomini kiriting..."
              />
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="English" name="en">
            <el-form-item label="Name (EN)" prop="name.en">
              <el-input v-model="form.name.en" placeholder="Enter name..." />
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="Русский" name="ru">
            <el-form-item label="Name (RU)" prop="name.ru">
              <el-input
                v-model="form.name.ru"
                placeholder="Введите название..."
              />
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="Кирилл" name="krill">
            <el-form-item label="Name (KRILL)" prop="name.krill">
              <el-input
                v-model="form.name.krill"
                placeholder="Номини киритинг..."
              />
            </el-form-item>
          </el-tab-pane>
        </el-tabs>

        <div
          class="grid grid-cols-1 gap-4 mt-4 border-t border-gray-200/70 dark:border-gray-700/70 pt-4"
        >
          <el-form-item label="Parent Organization" prop="parentId">
            <el-select
              v-model="form.parentId"
              placeholder="Parent organization tanlang"
              clearable
              filterable
              class="w-full"
              :disabled="isViewMode"
            >
              <el-option
                v-for="org in parentOptions"
                :key="org.id"
                :value="org.id"
                :label="useGetTranslation(org.name)"
              />
            </el-select>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <!-- ✅ FOOTER (QOTADI) -->
    <template #footer>
      <div class="dlg-footer">
        <el-button size="large" @click="onCancel" class="!px-6">
          {{ isViewMode ? "Yopish" : "Bekor qilish" }}
        </el-button>

        <el-button
          v-if="!isViewMode"
          type="primary"
          size="large"
          :loading="loading"
          @click="onSubmit"
          class="!px-8"
        >
          Saqlash
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, reactive, computed } from "vue";
import api from "@/utils/axios";
import { ElMessage } from "element-plus";
import { Plus, Edit, View } from "@element-plus/icons-vue";

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

const parentOptions = computed(() => {
  const selfId = props.editData?.id;
  return (props.organizations || []).filter((o: any) => o.id !== selfId);
});

const rules = {
  "name.uz": [{ required: true, message: "Majburiy", trigger: "blur" }],
  "name.en": [{ required: true, message: "Majburiy", trigger: "blur" }],
  "name.ru": [{ required: true, message: "Majburiy", trigger: "blur" }],
  "name.krill": [{ required: true, message: "Majburiy", trigger: "blur" }],
};

const dialogVisible = computed({
  get: () => props.open,
  set: (val) => emit("update:open", val),
});

const resetForm = () => {
  Object.assign(form.name, { uz: "", en: "", ru: "", krill: "" });
  form.parentId = null;
  activeTab.value = "uz";
  formRef.value?.clearValidate?.();
};

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return;

    if (props.editData?.id) {
      Object.assign(form.name, {
        uz: props.editData?.name?.uz || "",
        en: props.editData?.name?.en || "",
        ru: props.editData?.name?.ru || "",
        krill: props.editData?.name?.krill || "",
      });
      form.parentId = props.editData?.parentId ?? null;
    } else {
      resetForm();
    }
  },
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

    if (props.editData?.id) {
      await api.put(`/organizations/${props.editData.id}`, payload);
    } else {
      await api.post("/organizations", payload);
    }

    ElMessage.success("Muvaffaqiyatli saqlandi");
    emit("save");
    dialogVisible.value = false;
    resetForm();
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || "Xatolik yuz berdi");
  } finally {
    loading.value = false;
  }
};

const onCancel = () => {
  dialogVisible.value = false;
  resetForm();
};
</script>

<style scoped>
/* ✅ Dialog flex layout: modal scroll bo‘lmaydi */
.modern-org-dialog :deep(.el-dialog) {
  @apply bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden;
  max-height: 65vh;
  display: flex;
  flex-direction: column;
  margin: auto !important;
}

.modern-org-dialog :deep(.el-dialog__header),
.modern-org-dialog :deep(.el-dialog__footer) {
  @apply !p-0;
  flex-shrink: 0;
}

.modern-org-dialog :deep(.el-dialog__body) {
  @apply !p-0;
  flex: 1;
  min-height: 0;
  overflow: hidden; /* ✅ modal scroll OFF */
  display: flex;
  flex-direction: column;
}

/* Header */
.dlg-header {
  @apply flex items-center gap-3 px-6 py-4 border-b border-gray-200 dark:border-gray-700
         bg-white dark:bg-gray-900;
}
.dlg-icon {
  @apply w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600
         flex items-center justify-center shadow-lg;
}

/* ✅ only body scroll */
.dlg-body-scroll {
  @apply px-6 py-6;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Footer */
.dlg-footer {
  @apply flex items-center justify-end gap-3 px-6 py-4
         border-t border-gray-200 dark:border-gray-700
         bg-gray-50 dark:bg-gray-800/50;
}

/* input/select styling (users bilan mos) */
:deep(.el-form-item__label) {
  @apply text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2;
}
:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  @apply shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700;
  @apply hover:border-blue-400 focus-within:border-blue-500 transition-all duration-200;
}
:deep(.el-input__wrapper.is-focus),
:deep(.el-select__wrapper.is-focus) {
  @apply shadow-md ring-2 ring-blue-100 dark:ring-blue-900/50;
}
</style>
