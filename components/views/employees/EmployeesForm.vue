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
    class="modern-employee-dialog"
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
          <EmployeeImageUpload
            v-model="form.image"
            :initial-preview="imagePreview"
            :disabled="isViewMode"
          />
          <EmployeeFormFields v-model="form" />
        </el-form>
      </div>
    </div>

    <!-- Footer -->
    <template #footer>
      <div
        class="flex items-center justify-end gap-3 bg-gray-50 dark:bg-gray-800/50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg"
      >
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
          <template #icon
            ><el-icon><Check /></el-icon
          ></template>
          {{ isEditMode ? $t("common.update") : $t("common.create") }}
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
  fullNameUz: [
    { required: true, message: "F.I.O kiritish majburiy", trigger: "blur" },
  ],
  positionUz: [
    { required: true, message: "Lavozim kiritish majburiy", trigger: "blur" },
  ],
  image: [
    { required: true, message: "Rasm yuklash majburiy", trigger: "change" },
  ],
};

const dialogVisible = computed({
  get: () => props.open,
  set: (val) => emit("update:open", val),
});

const resetForm = () => {
  form.value = {
    fullNameUz: "",
    fullNameEn: "",
    fullNameRu: "",
    fullNameKiril: "",
    positionUz: "",
    positionEn: "",
    positionRu: "",
    positionKiril: "",
    image: "",
    managerId: null,
  };
  imagePreview.value = "";
  formRef.value?.clearValidate();
};

watch(
  () => props.editData,
  (newVal) => {
    if (props.isEditMode && newVal) {
      form.value = {
        fullNameUz: newVal.fullNameUz || "",
        fullNameEn: newVal.fullNameEn || "",
        fullNameRu: newVal.fullNameRu || "",
        fullNameKiril: newVal.fullNameKiril || "",
        positionUz: newVal.positionUz || "",
        positionEn: newVal.positionEn || "",
        positionRu: newVal.positionRu || "",
        positionKiril: newVal.positionKiril || "",
        image: newVal.image || "",
        managerId: newVal.managerId || null,
      };
      imagePreview.value = newVal.image || "";
    } else {
      resetForm();
    }
  },
  { immediate: true },
);

const onSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return;

    loading.value = true;
    try {
      const payload = {
        fullNameUz: form.value.fullNameUz,
        fullNameEn: form.value.fullNameEn,
        fullNameRu: form.value.fullNameRu,
        fullNameKiril: form.value.fullNameKiril,
        positionUz: form.value.positionUz,
        positionEn: form.value.positionEn,
        positionRu: form.value.positionRu,
        positionKiril: form.value.positionKiril,
        image: form.value.image,
        managerId: form.value.managerId,
      };

      if (props.isEditMode && props.editData?.id) {
        await api.put(`/employee/${props.editData.id}`, payload);
        ElMessage.success("Xodim ma'lumotlari yangilandi");
      } else {
        await api.post("/employee", payload);
        ElMessage.success("Yangi xodim qo'shildi");
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
.modern-employee-dialog :deep(.el-dialog) {
  @apply bg-white dark:bg-gray-900 rounded-xl shadow-2xl;
  max-height: 85vh;
  height: 85vh;
  display: flex;
  flex-direction: column;
  margin: auto !important;
  overflow: hidden;
}

.modern-employee-dialog :deep(.el-overlay) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.modern-employee-dialog :deep(.el-dialog__header) {
  @apply border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900;
  flex-shrink: 0;
  padding: 20px 24px 16px;
  margin: 0;
}

.modern-employee-dialog :deep(.el-dialog__body) {
  @apply bg-white dark:bg-gray-900;
  padding: 0;
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.modern-employee-dialog :deep(.el-dialog__footer) {
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

.modern-form :deep(.el-input__wrapper) {
  @apply shadow-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600;
  @apply hover:border-blue-400 focus-within:border-blue-500;
  @apply transition-all duration-200;
}

.modern-form :deep(.el-input__wrapper.is-focus) {
  @apply shadow-md ring-2 ring-blue-100 dark:ring-blue-900/50;
}

.modern-form :deep(.el-input-number) {
  @apply w-full;
}

:deep(.el-button--primary) {
  @apply bg-blue-600 hover:bg-blue-700;
  @apply shadow-sm hover:shadow-md;
}

.modern-form :deep(.el-form-item.is-error .el-input__wrapper) {
  @apply border-red-500 shadow-sm;
}
</style>