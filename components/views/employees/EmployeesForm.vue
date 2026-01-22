<template>
  <el-dialog
    v-model="dialogVisible"
    :title="
      isViewMode
        ? $t('employee.view')
        : isEditMode
          ? $t('employee.edit')
          : $t('employee.add')
    "
    width="700px"
    :close-on-click-modal="true"
    :lock-scroll="true"
    :align-center="true"
    class="modern-employee-dialog"
    destroy-on-close
  >
    <div class="dialog-layout-wrapper">
      <div class="dialog-header-section border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900 flex items-center justify-center">
            <el-icon :size="20" class="text-blue-600 dark:text-blue-400">
              <component :is="isViewMode ? 'View' : isEditMode ? 'Edit' : 'Plus'" />
            </el-icon>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{
                isViewMode
                  ? "Xodim ma'lumotlari"
                  : isEditMode
                    ? $t("employee.editEmployee")
                    : $t("employee.createEmployee")
              }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{
                isViewMode
                  ? "Xodim haqida to'liq ma'lumot"
                  : isEditMode
                    ? "Xodim ma'lumotlarini tahrirlash"
                    : "Yangi xodim qo'shish"
              }}
            </p>
          </div>
        </div>
      </div>

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
          <EmployeeImageUpload
            v-model="form.image"
            :initial-preview="imagePreview"
            :disabled="isViewMode"
            :is-edit-mode="isEditMode"
          />
          <EmployeeFormFields v-model="form" />
        </el-form>
      </div>

      <div class="dialog-footer-section border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div class="flex items-center justify-end gap-3 px-6 py-4">
          <el-button size="large" @click="onCancel" class="px-6">
            {{ isViewMode ? $t("common.close") : $t("common.cancel") }}
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
            {{ isEditMode ? $t("common.update") : $t("common.create") }}
          </el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
import { Plus, Edit, Check, View } from "@element-plus/icons-vue";
import api from "@/utils/axios";
import EmployeeImageUpload from "./EmployeeImageUpload.vue";
import EmployeeFormFields from "./EmployeeFormFields.vue";

const props = defineProps<{
  open: boolean;
  isEditMode: boolean;
  isViewMode?: boolean;
  editData: any;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "save"): void;
}>();

const formRef = ref<FormInstance>();
const loading = ref(false);
const imagePreview = ref("");

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("data:") || imagePath.startsWith("http")) return imagePath;
  return `https://reestr.das-uty.uz/api/${imagePath}`;
};

const form = ref({
  fullNameUz: "",
  fullNameEn: "",
  fullNameRu: "",
  fullNameKiril: "",
  positionUz: "",
  positionEn: "",
  positionRu: "",
  positionKiril: "",
  image: "",
  managerId: null as number | null,
});

const rules = {
  fullNameUz: [{ required: true, message: "F.I.O kiritish majburiy", trigger: "blur" }],
  positionUz: [{ required: true, message: "Lavozim kiritish majburiy", trigger: "blur" }],
  image: [{ required: true, message: "Rasm yuklash majburiy", trigger: "change" }],
};

const dialogVisible = computed({
  get: () => props.open,
  set: (val) => emit("update:open", val),
});

const resetForm = () => {
  form.value = {
    fullNameUz: "", fullNameEn: "", fullNameRu: "", fullNameKiril: "",
    positionUz: "", positionEn: "", positionRu: "", positionKiril: "",
    image: "", managerId: null,
  };
  imagePreview.value = "";
  formRef.value?.clearValidate();
};

// MUHIM: Dialog ochilganda ma'lumotlarni yuklash
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      if ((props.isEditMode || props.isViewMode) && props.editData) {
        // Edit yoki View rejimida - mavjud ma'lumotlarni yuklash
        form.value = {
          fullNameUz: props.editData.fullNameUz || "",
          fullNameEn: props.editData.fullNameEn || "",
          fullNameRu: props.editData.fullNameRu || "",
          fullNameKiril: props.editData.fullNameKiril || "",
          positionUz: props.editData.positionUz || "",
          positionEn: props.editData.positionEn || "",
          positionRu: props.editData.positionRu || "",
          positionKiril: props.editData.positionKiril || "",
          image: props.editData.image || "",
          managerId: props.editData.managerId || null,
        };
        // MUHIM: Mavjud rasmni ko'rsatish uchun imagePreview ni to'ldirish
        imagePreview.value = props.editData.image || "";
        imagePreview.value = props.editData.image ? getImageUrl(props.editData.image) : "";
      } else {
        // Yangi xodim qo'shish rejimida
        resetForm();
      }
      // Validatsiya xatolarini tozalash
      formRef.value?.clearValidate();
    }
  },
  { immediate: true }
);

const onSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (!valid) return;
    loading.value = true;
    try {
      if (props.isEditMode && props.editData?.id) {
        await api.put(`/employee/${props.editData.id}`, form.value);
        ElMessage.success("Ma'lumotlar muvaffaqiyatli yangilandi");
      } else {
        await api.post("/employee", form.value);
        ElMessage.success("Xodim muvaffaqiyatli qo'shildi");
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
  emit("update:open", false);
  resetForm();
};
</script>

<style scoped>
.modern-employee-dialog :deep(.el-dialog) {
  @apply bg-white dark:bg-gray-900 rounded-xl shadow-2xl;
  max-height: 90vh;
  height: auto;
  display: flex;
  flex-direction: column;
  margin: 0 auto !important;
  overflow: hidden;
}

.modern-employee-dialog :deep(.el-dialog__body) {
  padding: 0 !important;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.modern-employee-dialog :deep(.el-dialog__header) {
  display: none;
}

.dialog-layout-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 90vh;
}

.dialog-header-section {
  flex-shrink: 0;
  padding: 24px;
  background: inherit;
}

.dialog-scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  min-height: 0;
}

.dialog-footer-section {
  flex-shrink: 0;
}

.dialog-scrollable-content::-webkit-scrollbar {
  width: 8px;
}

.dialog-scrollable-content::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800 rounded-full;
}

.dialog-scrollable-content::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded-full;
}

.dialog-scrollable-content::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}

.modern-form :deep(.el-form-item__label) {
  @apply text-sm font-semibold text-gray-700 dark:text-gray-300;
}

/* Responsive */
@media (max-width: 768px) {
  .modern-employee-dialog :deep(.el-dialog) {
    width: 95% !important;
    max-height: 95vh;
  }
  
  .dialog-header-section,
  .dialog-scrollable-content,
  .dialog-footer-section {
    padding: 16px;
  }
}
</style>