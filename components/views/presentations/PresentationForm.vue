<template>
  <el-dialog
    v-model="dialogVisible"
    :title="
      isViewMode
        ? 'Taqdimotni ko\'rish'
        : isEditMode
          ? 'Taqdimotni tahrirlash'
          : 'Yangi taqdimot qo\'shish'
    "
    width="900px"
    :close-on-click-modal="false"
    :lock-scroll="true"
    class="modern-presentation-dialog"
    destroy-on-close
    append-to-body
  >
    <div class="dialog-content">
      <!-- Header -->
      <div
        class="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700"
      >
        <div
          class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900 flex items-center justify-center"
        >
          <el-icon :size="20" class="text-blue-600 dark:text-blue-400">
            <component
              :is="isViewMode ? 'View' : isEditMode ? 'Edit' : 'Plus'"
            />
          </el-icon>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{
              isViewMode
                ? "Taqdimot ma'lumotlari"
                : isEditMode
                  ? "Taqdimotni tahrirlash"
                  : "Yangi taqdimot yaratish"
            }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{
              isViewMode
                ? "Taqdimot haqida to'liq ma'lumot"
                : isEditMode
                  ? "Taqdimot ma'lumotlarini tahrirlash"
                  : "Yangi taqdimot qo'shish"
            }}
          </p>
        </div>
      </div>

      <!-- Scrollable Content -->
      <div class="dialog-scrollable-content">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
          size="large"
          class="modern-form"
          :disabled="isViewMode"
        >
          <!-- Images Section -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Logo *
              </label>
              <PresentationImageUpload
                v-model="form.logo"
                :initial-preview="logoPreview"
                :disabled="isViewMode"
                upload-type="logo"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Banner rasm *
              </label>
              <PresentationImageUpload
                v-model="form.image"
                :initial-preview="imagePreview"
                :disabled="isViewMode"
                upload-type="image"
              />
            </div>
          </div>

          <!-- Color Picker -->
          <el-form-item label="Rang *" prop="color" class="mb-6">
            <PresentationColorPicker v-model="form.color" :disabled="isViewMode" />
          </el-form-item>

          <!-- Form Fields -->
          <PresentationFormFields v-model="form" :disabled="isViewMode" />

          <!-- Features Manager -->
          <div class="mt-6">
            <PresentationFeaturesManager
              v-model="form.features"
              :disabled="isViewMode"
            />
          </div>
        </el-form>
      </div>
    </div>

    <!-- Footer -->
    <template #footer>
      <div
        class="flex items-center justify-end gap-3 bg-gray-50 dark:bg-gray-800/50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg"
      >
        <el-button size="large" @click="onCancel" class="px-6">
          {{ isViewMode ? "Yopish" : "Bekor qilish" }}
        </el-button>
        <el-button
          v-if="!isViewMode"
          type="primary"
          size="large"
          @click="onSubmit"
          :loading="loading"
          class="px-6"
        >
          <template #icon>
            <el-icon><Check /></el-icon>
          </template>
          {{ isEditMode ? "Saqlash" : "Yaratish" }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
import { Plus, Edit, Check, View } from "@element-plus/icons-vue";
import api from "@/utils/axios";
import type { Presentation, PresentationFormData, Feature } from "@/types";
import PresentationImageUpload from "./PresentationImageUpload.vue";
import PresentationColorPicker from "./PresentationColorPicker.vue";
import PresentationFormFields from "./PresentationFormFields.vue";
import PresentationFeaturesManager from "./PresentationFeaturesManager.vue";

const props = defineProps<{
  open: boolean;
  isEditMode: boolean;
  isViewMode?: boolean;
  editData: Presentation | null;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "save"): void;
}>();

const formRef = ref<FormInstance>();
const loading = ref(false);
const logoPreview = ref("");
const imagePreview = ref("");

const form = ref<PresentationFormData>({
  titleUz: "",
  titleRu: "",
  titleEn: "",
  titleKiril: "",
  subtitleUz: "",
  subtitleRu: "",
  subtitleEn: "",
  subtitleKiril: "",
  descriptionTitleUz: "",
  descriptionTitleRu: "",
  descriptionTitleEn: "",
  descriptionTitleKiril: "",
  descriptionUz: "",
  descriptionRu: "",
  descriptionEn: "",
  descriptionKiril: "",
  color: "#2563eb",
  image: "",
  logo: "",
  features: [],
});

const rules = {
  titleUz: [
    { required: true, message: "Sarlavha (O'zbekcha) kiritish majburiy", trigger: "blur" },
  ],
  subtitleUz: [
    { required: true, message: "Qo'shimcha sarlavha kiritish majburiy", trigger: "blur" },
  ],
  descriptionTitleUz: [
    { required: true, message: "Tavsif sarlavhasi kiritish majburiy", trigger: "blur" },
  ],
  descriptionUz: [
    { required: true, message: "Tavsif kiritish majburiy", trigger: "blur" },
  ],
  color: [
    { required: true, message: "Rang tanlash majburiy", trigger: "change" },
  ],
  logo: [
    { required: true, message: "Logo yuklash majburiy", trigger: "change" },
  ],
  image: [
    { required: true, message: "Banner rasm yuklash majburiy", trigger: "change" },
  ],
};

const dialogVisible = computed({
  get: () => props.open,
  set: (val) => emit("update:open", val),
});

const resetForm = () => {
  form.value = {
    titleUz: "",
    titleRu: "",
    titleEn: "",
    titleKiril: "",
    subtitleUz: "",
    subtitleRu: "",
    subtitleEn: "",
    subtitleKiril: "",
    descriptionTitleUz: "",
    descriptionTitleRu: "",
    descriptionTitleEn: "",
    descriptionTitleKiril: "",
    descriptionUz: "",
    descriptionRu: "",
    descriptionEn: "",
    descriptionKiril: "",
    color: "#2563eb",
    image: "",
    logo: "",
    features: [],
  };
  logoPreview.value = "";
  imagePreview.value = "";
  formRef.value?.clearValidate();
};

watch(
  () => props.editData,
  (newVal) => {
    if ((props.isEditMode || props.isViewMode) && newVal) {
      form.value = {
        titleUz: newVal.titleUz || "",
        titleRu: newVal.titleRu || "",
        titleEn: newVal.titleEn || "",
        titleKiril: newVal.titleKiril || "",
        subtitleUz: newVal.subtitleUz || "",
        subtitleRu: newVal.subtitleRu || "",
        subtitleEn: newVal.subtitleEn || "",
        subtitleKiril: newVal.subtitleKiril || "",
        descriptionTitleUz: newVal.descriptionTitleUz || "",
        descriptionTitleRu: newVal.descriptionTitleRu || "",
        descriptionTitleEn: newVal.descriptionTitleEn || "",
        descriptionTitleKiril: newVal.descriptionTitleKiril || "",
        descriptionUz: newVal.descriptionUz || "",
        descriptionRu: newVal.descriptionRu || "",
        descriptionEn: newVal.descriptionEn || "",
        descriptionKiril: newVal.descriptionKiril || "",
        color: newVal.color || "#2563eb",
        image: newVal.image || "",
        logo: newVal.logo || "",
        features: newVal.features || [],
      };
      logoPreview.value = newVal.logo || "";
      imagePreview.value = newVal.image || "";
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

const onSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return;

    // Features validation
    if (form.value.features.length === 0) {
      ElMessage.warning("Kamida bitta xususiyat qo'shish kerak");
      return;
    }

    loading.value = true;
    try {
      const payload = {
        ...form.value,
        features: form.value.features.map((feature) => ({
          titleUz: feature.titleUz,
          titleRu: feature.titleRu,
          titleEn: feature.titleEn,
          titleKiril: feature.titleKiril,
          descriptionUz: feature.descriptionUz,
          descriptionRu: feature.descriptionRu,
          descriptionEn: feature.descriptionEn,
          descriptionKiril: feature.descriptionKiril,
          icon: feature.icon,
        })),
      };

      if (props.isEditMode && props.editData?.id) {
        await api.put(`/presentation/${props.editData.id}`, payload);
        ElMessage.success("Taqdimot muvaffaqiyatli yangilandi");
      } else {
        await api.post("/presentation", payload);
        ElMessage.success("Yangi taqdimot qo'shildi");
      }
      emit("save");
      emit("update:open", false);
      resetForm();
    } catch (error: any) {
      ElMessage.error(error.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      loading.value = false;
    }
  });
};

const onCancel = () => {
  resetForm();
  emit("update:open", false);
};
</script>

<style scoped>
.modern-presentation-dialog :deep(.el-dialog) {
  @apply bg-white dark:bg-gray-900 rounded-xl shadow-2xl;
  max-height: 90vh;
  height: 90vh;
  display: flex;
  flex-direction: column;
  margin: auto !important;
  overflow: hidden;
}

.modern-presentation-dialog :deep(.el-overlay) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.modern-presentation-dialog :deep(.el-dialog__header) {
  @apply border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900;
  flex-shrink: 0;
  padding: 20px 24px 16px;
  margin: 0;
}

.modern-presentation-dialog :deep(.el-dialog__body) {
  @apply bg-white dark:bg-gray-900;
  padding: 0;
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.modern-presentation-dialog :deep(.el-dialog__footer) {
  flex-shrink: 0;
  padding: 0;
  margin: 0;
}

.dialog-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  min-height: 0;
}

.dialog-content > div:first-child {
  flex-shrink: 0;
  padding: 0 24px 16px;
}

.dialog-scrollable-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 24px;
  min-height: 0;
}

.dialog-scrollable-content::-webkit-scrollbar {
  width: 6px;
}

.dialog-scrollable-content::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800;
  border-radius: 3px;
}

.dialog-scrollable-content::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600;
  border-radius: 3px;
}

.dialog-scrollable-content::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}

.modern-form :deep(.el-form-item__label) {
  @apply text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2;
}

.modern-form :deep(.el-input__wrapper),
.modern-form :deep(.el-textarea__inner) {
  @apply shadow-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600;
  @apply hover:border-blue-400 focus-within:border-blue-500;
  @apply transition-all duration-200;
}

.modern-form :deep(.el-input__wrapper.is-focus),
.modern-form :deep(.el-textarea__inner:focus) {
  @apply shadow-md ring-2 ring-blue-100 dark:ring-blue-900/50;
}

:deep(.el-button--primary) {
  @apply bg-blue-600 hover:bg-blue-700;
  @apply shadow-sm hover:shadow-md;
}

.modern-form :deep(.el-form-item.is-error .el-input__wrapper),
.modern-form :deep(.el-form-item.is-error .el-textarea__inner) {
  @apply border-red-500 shadow-sm;
}
</style>