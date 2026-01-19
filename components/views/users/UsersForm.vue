<template>
  <el-dialog
    v-model="isOpen"
    :title="isEditMode ? $t('user.edit') : $t('user.create')"
    width="600px"
    :close-on-click-modal="true"
    :close-on-press-escape="false"
    class="modern-user-dialog"
  >
    <div class="dialog-content">
      <!-- Header with icon -->
      <div
        class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700"
      >
        <div
          class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-yellow-500 flex items-center justify-center"
        >
          <el-icon :size="20" class="text-blue-600 dark:text-blue-400">
            <component :is="isEditMode ? 'Edit' : 'Plus'" />
          </el-icon>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-black">
            {{ isEditMode ? $t("user.editUser") : $t("user.createUser") }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-black">
            {{
              isEditMode
                ? $t("user.editDescription")
                : $t("user.createDescription")
            }}
          </p>
        </div>
      </div>

      <el-form
        ref="formRef"
        size="large"
        label-position="top"
        autocomplete="off"
        :model="formState"
        @submit.prevent
        class="modern-form"
      >
        <!-- Image Upload Section -->
        <div class="mb-6 flex flex-col items-center">
          <div class="relative" v-loading="imageUploading">
            <!-- Avatar Preview -->
            <div class="relative group">
              <el-avatar
                :size="120"
                :src="
                  imagePreview ||
                  'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
                "
                class="border-4 border-gray-100 dark:border-gray-700 shadow-lg ring-2 ring-gray-200 dark:ring-gray-600"
              />

              <!-- Hover Overlay -->
              <div
                v-if="!imageUploading"
                class="absolute inset-0 bg-black/60 dark:bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer"
                @click="triggerUpload"
              >
                <el-icon :size="32" class="text-white">
                  <component :is="'Camera'" />
                </el-icon>
              </div>

              <!-- Remove Button -->
              <el-button
                v-if="uploadedImagePath && !imageUploading"
                circle
                type="danger"
                size="small"
                class="absolute -top-2 -right-2 shadow-lg hover:scale-110 transition-transform"
                @click="clearImage"
              >
                <el-icon><component :is="'Close'" /></el-icon>
              </el-button>
            </div>
          </div>

          <!-- Hidden Upload -->
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :show-file-list="false"
            accept="image/*"
            :on-change="handleImageChange"
            class="hidden"
          >
            <el-button ref="uploadButtonRef" />
          </el-upload>

          <!-- Upload Instructions -->
          <div class="mt-4 text-center">
            <el-button
              type="primary"
              link
              :icon="ElIconUpload"
              @click="triggerUpload"
              :loading="imageUploading"
              class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              {{
                uploadedImagePath
                  ? $t("user.changeImage")
                  : $t("user.selectImage")
              }}
            </el-button>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              JPG, PNG yoki GIF (max. 5MB)
            </p>
          </div>
        </div>

        <!-- Form Fields -->
        <div class="space-y-5">
          <!-- Full Name -->
          <el-form-item
            :label="$t('user.fullName')"
            prop="fullName"
            :rules="useRules.requiredField()"
            class="modern-form-item"
          >
            <el-input
              v-model="formState.fullName"
              :placeholder="$t('user.enterFullName')"
              :prefix-icon="ElIconUser"
              clearable
              class="modern-input"
            />
          </el-form-item>

          <!-- Username -->
          <el-form-item
            :label="$t('user.username')"
            prop="username"
            :rules="useRules.requiredField()"
            class="modern-form-item"
          >
            <el-input
              v-model="formState.username"
              :placeholder="$t('user.enterUsername')"
              :prefix-icon="ElIconUser"
              clearable
              class="modern-input"
            />
          </el-form-item>

          <!-- Password -->
          <el-form-item
            :label="$t('user.password')"
            prop="password"
            :rules="useRules.requiredField()"
            class="modern-form-item"
          >
            <el-input
              v-model="formState.password"
              type="password"
              show-password
              :placeholder="$t('user.enterPassword')"
              :prefix-icon="ElIconLock"
              clearable
              class="modern-input"
            />
          </el-form-item>

          <!-- Role -->
          <!-- <el-form-item
            :label="$t('user.role')"
            prop="role"
            class="modern-form-item"
          >
            <el-select
              v-model="formState.role"
              :placeholder="$t('user.selectRole')"
              class="w-full modern-select"
              clearable
            >
              <el-option label="Admin" value="admin" />
              <el-option label="Manager" value="manager" />
              <el-option label="User" value="user" />
            </el-select>
          </el-form-item> -->
        </div>
      </el-form>
    </div>

    <!-- Footer Actions -->
    <template #footer>
      <div
        class="flex items-center justify-end gap-3 bg-gray-50 dark:bg-gray-800/50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg"
      >
        <el-button
          size="large"
          @click="onCancel"
          :disabled="saveLoading"
          class="px-6 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {{ $t("common.cancel") }}
        </el-button>
        <el-button
          type="primary"
          size="large"
          @click="onSubmit"
          :loading="saveLoading"
          :disabled="imageUploading"
          class="px-6 bg-blue-600 justify-center text-center hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <template #icon>
            <el-icon><component :is="'Check'" /></el-icon>
          </template>
          {{ isEditMode ? $t("common.update") : $t("common.save") }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { FormInstance, UploadFile, UploadInstance } from "element-plus";
import {
  User as ElIconUser,
  Lock as ElIconLock,
  Upload as ElIconUpload,
} from "@element-plus/icons-vue";
import api from "@/utils/axios";

type FormState = {
  fullName: string;
  username: string;
  password: string;
};

const { t } = useI18n();

const props = defineProps<{
  open?: boolean;
  isEditMode?: boolean;
  editData?: any;
}>();

const emit = defineEmits(["save", "update:open"]);

const isOpen = ref<boolean>(!!props.open);

watch(
  () => props.open,
  (v) => {
    isOpen.value = !!v;
  },
);

watch(isOpen, (v) => {
  emit("update:open", v);
});

const formRef = ref<FormInstance>();
const uploadRef = ref<UploadInstance>();
const saveLoading = ref(false);
const imageUploading = ref(false);
const imagePreview = ref("");
const uploadedImagePath = ref("");

const getEmptyState = (): FormState => ({
  fullName: "",
  username: "",
  password: "",
});

const formState = ref<FormState>(getEmptyState());

const useRules = {
  requiredField: () => [
    { required: true, message: t("messages.required"), trigger: "blur" },
  ],
};

// Upload trigger
const triggerUpload = () => {
  const input = uploadRef.value?.$el.querySelector('input[type="file"]');
  input?.click();
};

// Rasm yuklash
const handleImageChange = async (file: UploadFile) => {
  if (!file.raw) return;

  if (file.raw.size > 5 * 1024 * 1024) {
    ElMessage.error(t("messages.fileTooLarge"));
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string;
  };
  reader.readAsDataURL(file.raw);

  try {
    imageUploading.value = true;
    const formData = new FormData();
    formData.append("file", file.raw);

    const res = await api.post("/files", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    uploadedImagePath.value = res.data?.data?.path || res.data?.path;
    ElMessage.success(t("messages.imageUploaded") || "Rasm yuklandi");
  } catch (error: any) {
    console.error("Upload error:", error);
    ElMessage.error(
      error.response?.data?.message || "Rasmni yuklashda xatolik",
    );
    imagePreview.value = "";
    uploadedImagePath.value = "";
  } finally {
    imageUploading.value = false;
  }
};

const clearImage = () => {
  imagePreview.value = "";
  uploadedImagePath.value = "";
};

const onSubmit = async () => {
  if (!formRef.value) return;

  if (imageUploading.value) {
    ElMessage.warning("Rasm hali yuklanmoqda, iltimos kuting...");
    return;
  }

  try {
    await formRef.value.validate();
    saveLoading.value = true;

    const payload = {
      fullName: formState.value.fullName,
      username: formState.value.username,
      password: formState.value.password,
      image: uploadedImagePath.value || null,
    };

    if (props.isEditMode && props.editData?.id) {
      await api.put(`/user/${props.editData.id}`, payload);
      ElNotification.success({
        title: t("messages.success"),
        message: t("messages.updated"),
      });
    } else {
      await api.post("/user", payload);
      ElNotification.success({
        title: t("messages.success"),
        message: t("messages.created"),
      });
    }

    emit("save");
    isOpen.value = false;
  } catch (e: any) {
    console.error("Submit error:", e);
    ElMessage.error(e.response?.data?.message || t("messages.error"));
  } finally {
    saveLoading.value = false;
  }
};

const onCancel = () => {
  isOpen.value = false;
};

watch(isOpen, (val) => {
  if (val) {
    if (props.isEditMode && props.editData) {
      formState.value = {
        fullName: props.editData.fullName || "",
        username: props.editData.username || "",
        password: "",
        // role: props.editData.role || "",
      };
      imagePreview.value = props.editData.image || "";
      uploadedImagePath.value = props.editData.image || "";
    } else {
      formState.value = getEmptyState();
      imagePreview.value = "";
      uploadedImagePath.value = "";
    }
    formRef.value?.clearValidate();
  }
});
</script>

<style scoped>
/* Dialog Styles */
.modern-user-dialog :deep(.el-dialog) {
  @apply bg-white dark:!bg-gray-900 rounded-xl shadow-2xl;
}

.modern-user-dialog :deep(.el-dialog__header) {
  @apply border-b border-gray-200 dark:border-gray-700 pb-4 bg-white dark:bg-gray-900;
}

.modern-user-dialog :deep(.el-dialog__title) {
  @apply text-gray-900 dark:text-gray-100;
}

.modern-user-dialog :deep(.el-dialog__headerbtn .el-dialog__close) {
  @apply text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200;
}

.modern-user-dialog :deep(.el-dialog__body) {
  @apply px-6 py-6 bg-white dark:bg-gray-900;
}

.modern-user-dialog :deep(.el-dialog__footer) {
  @apply p-0;
}

/* Form Styles */
.modern-form :deep(.el-form-item__label) {
  @apply text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2;
}

.modern-form :deep(.el-input__wrapper) {
  @apply shadow-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600;
  @apply hover:border-blue-400 dark:hover:border-blue-500;
  @apply focus-within:border-blue-500 dark:focus-within:border-blue-400;
  @apply transition-all duration-200;
}

.modern-form :deep(.el-input__wrapper.is-focus) {
  @apply shadow-md ring-2 ring-blue-100 dark:ring-blue-900/50;
}

.modern-form :deep(.el-input__inner) {
  @apply text-base text-gray-900 dark:text-gray-100;
  @apply placeholder:text-gray-400 dark:placeholder:text-gray-500;
}

.modern-form :deep(.el-input__prefix),
.modern-form :deep(.el-input__suffix) {
  @apply text-gray-500 dark:text-gray-400;
}

/* Select Styles */
.modern-select :deep(.el-select__wrapper) {
  @apply shadow-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600;
  @apply hover:border-blue-400 dark:hover:border-blue-500;
  @apply transition-all duration-200;
}

.modern-select :deep(.el-select__wrapper.is-focused) {
  @apply shadow-md ring-2 ring-blue-100 dark:ring-blue-900/50 border-blue-500 dark:border-blue-400;
}

.modern-select :deep(.el-select__placeholder) {
  @apply text-gray-400 dark:text-gray-500;
}

.modern-select :deep(.el-select__selected-item) {
  @apply text-gray-900 dark:text-gray-100;
}

/* Loading Overlay */
:deep(.el-loading-mask) {
  @apply bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm;
}

:deep(.el-loading-spinner .circular) {
  @apply text-blue-600 dark:text-blue-400;
}

/* Avatar Styles */
.modern-form :deep(.el-avatar) {
  @apply bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800;
}

/* Button Styles */
:deep(.el-button) {
  @apply transition-all duration-200;
}

.modern-user-dialog {
  @apply rounded-xl bg-white dark:bg-gray-500;
} 

:deep(.el-button--primary) {
  @apply bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600;
  @apply border-blue-600 dark:border-blue-500;
  @apply shadow-sm hover:shadow-md;
}

:deep(.el-button--default) {
  @apply bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600;
  @apply text-gray-700 dark:text-gray-300;
  @apply hover:bg-gray-50 dark:hover:bg-gray-700;
}

:deep(.el-button--danger) {
  @apply bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600;
}

/* Form Item Error Styles */
.modern-form :deep(.el-form-item.is-error .el-input__wrapper) {
  @apply border-red-500 dark:border-red-400 shadow-sm;
}

.modern-form :deep(.el-form-item__error) {
  @apply text-red-600 dark:text-red-400;
}

/* Smooth transitions */
* {
  @apply transition-colors duration-200;
}
</style>
