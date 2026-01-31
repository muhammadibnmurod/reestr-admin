<template>
  <el-dialog
    v-model="isOpen"
    width="650px"
    append-to-body
    destroy-on-close
    class="user-dialog"
  >
    <!-- HEADER -->
    <template #header>
      <div
        class="flex items-center gap-3 px-6 py-4 border-b border-gray-200 dark:border-gray-700"
      >
        <div
          class="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg"
        >
          <el-icon :size="18" class="text-white">
            <component :is="isEditMode ? Edit : Plus" />
          </el-icon>
        </div>

        <div class="flex-1">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            {{ isEditMode ? $t("user.editUser") : $t("user.createUser") }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {{
              isEditMode
                ? $t("user.editDescription")
                : $t("user.createDescription")
            }}
          </p>
        </div>
      </div>
    </template>

    <!-- BODY (scroll faqat shu joyda) -->

    <div class="body-scroll px-6 py-5">
      <el-form
        ref="formRef"
        size="default"
        label-position="top"
        :model="formState"
        @submit.prevent
      >
        <!-- Avatar -->
        <div class="mb-6 flex flex-col items-center">
          <div v-loading="imageUploading" class="relative">
            <div class="relative group">
              <el-avatar
                :size="96"
                :src="
                  imagePreview ||
                  toFileUrl(uploadedImagePath || formState.image)
                "
                :icon="ElIconUser"
                class="bg-gray-100 dark:bg-gray-700 cursor-pointer"
              />
              <div
                v-if="!imageUploading"
                @click="triggerUpload"
                class="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer backdrop-blur-sm"
              >
                <el-icon :size="26" class="text-white"><Camera /></el-icon>
              </div>

              <el-button
                v-if="uploadedImagePath && !imageUploading"
                circle
                type="danger"
                size="small"
                class="!absolute -top-2 -right-2 shadow-lg hover:scale-110 transition-transform"
                @click="clearImage"
              >
                <el-icon><Close /></el-icon>
              </el-button>
            </div>
          </div>

          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :show-file-list="false"
            accept="image/*"
            :on-change="handleImageChange"
            class="hidden"
          >
            <el-button />
          </el-upload>

          <div class="mt-3 text-center">
            <el-button
              type="primary"
              link
              :icon="ElIconUpload"
              @click="triggerUpload"
              :disabled="imageUploading"
            >
              {{
                uploadedImagePath
                  ? $t("user.changeImage")
                  : $t("user.selectImage")
              }}
            </el-button>
            <p class="text-xs text-gray-400 mt-1">PNG, JPG (max 5MB)</p>
          </div>
        </div>

        <!-- FIELDS -->
        <div class="space-y-4">
          <el-form-item
            :label="$t('user.fullName')"
            prop="fullName"
            :rules="[{ required: true, message: requiredMsg, trigger: 'blur' }]"
          >
            <el-input
              v-model="formState.fullName"
              :prefix-icon="ElIconUser"
              clearable
              :placeholder="$t('user.fullNamePlaceholder')"
            />
          </el-form-item>

          <el-form-item
            :label="$t('user.username')"
            prop="username"
            :rules="[{ required: true, message: requiredMsg, trigger: 'blur' }]"
          >
            <el-input
              v-model="formState.username"
              :prefix-icon="ElIconUser"
              clearable
              :placeholder="$t('user.usernamePlaceholder')"
            />
          </el-form-item>

          <el-form-item
            :label="$t('user.password')"
            prop="password"
            :rules="
              isEditMode
                ? []
                : [{ required: true, message: requiredMsg, trigger: 'blur' }]
            "
          >
            <el-input
              v-model="formState.password"
              type="password"
              show-password
              :prefix-icon="ElIconLock"
              clearable
              :placeholder="
                isEditMode
                  ? $t('user.passwordOptional')
                  : $t('user.passwordPlaceholder')
              "
            />
          </el-form-item>

          <el-form-item
            :label="$t('user.role')"
            prop="role"
            :rules="[
              { required: true, message: requiredMsg, trigger: 'change' },
            ]"
          >
            <el-select
              v-model="formState.role"
              :placeholder="$t('user.selectRole')"
              class="w-full"
            >
              <el-option
                v-for="opt in UserRoleOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              >
                <span class="flex items-center gap-2">
                  <span
                    class="w-2 h-2 rounded-full"
                    :class="
                      opt.value === 'admin' ? 'bg-red-500' : 'bg-blue-500'
                    "
                  />
                  {{ opt.label }}
                </span>
              </el-option>
            </el-select>
          </el-form-item>

          <!-- ✅ ORGANIZATION SELECT -->
          <el-form-item
            :label="$t('organization.title')"
            prop="organizationId"
            :rules="[
              { required: true, message: requiredMsg, trigger: 'change' },
            ]"
          >
            <el-select
              v-model="formState.organizationId"
              class="w-full"
              filterable
              clearable
              :loading="orgLoading"
              :placeholder="$t('organization.selectOrganization')"
            >
              <el-option
                v-for="org in organizations"
                :key="org.id"
                :label="getOrgLabel(org)"
                :value="org.id"
              />
            </el-select>

            <div v-if="orgError" class="text-xs text-red-500 mt-1">
              {{ orgError }}
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <!-- FOOTER -->
    <template #footer>
      <div class="footer-bar px-6 py-4">
        <el-button size="default" @click="onCancel" :disabled="saveLoading">
          {{ $t("common.cancel") }}
        </el-button>

        <el-button
          type="primary"
          size="default"
          @click="onSubmit"
          :loading="saveLoading"
          :disabled="imageUploading"
          class="!px-8"
        >
          <template #icon
            ><el-icon><Check /></el-icon
          ></template>
          {{ isEditMode ? $t("common.update") : $t("common.save") }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance, UploadFile, UploadInstance } from "element-plus";
import {
  User as ElIconUser,
  Lock as ElIconLock,
  Upload as ElIconUpload,
  Camera,
  Close,
  Check,
  Plus,
  Edit,
} from "@element-plus/icons-vue";
import api from "@/utils/axios";
import { useI18n } from "vue-i18n";

import { UserRole } from "@/enums/UserRole";
import { UserRoleOptions } from "@/constants/user-role";

const { t } = useI18n();

const requiredMsg = computed(() => t("messages.required") || "Majburiy");

const props = defineProps<{
  open?: boolean;
  isEditMode?: boolean;
  editData?: any;
}>();

const emit = defineEmits<{
  (e: "save"): void;
  (e: "update:open", value: boolean): void;
}>();

const isOpen = ref(!!props.open);
const formRef = ref<FormInstance>();
const uploadRef = ref<UploadInstance>();

// const toFileUrl = (path?: string) => {
//   if (!path) return "";
//   if (path.startsWith("http")) return path;
//   return `https://reestr.das-uty.uz/api/${path}`;
// };

const toFileUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `https://reestr.das-uty.uz/api/${path}`;
};

const saveLoading = ref(false);
const imageUploading = ref(false);
const imagePreview = ref("");
const uploadedImagePath = ref("");

// ✅ organizations list
const organizations = ref<any[]>([]);
const orgLoading = ref(false);
const orgError = ref("");

const formState = ref({
  fullName: "",
  username: "",
  password: "",
  image: "",
  role: UserRole.USER,
  organizationId: null as number | null,
});

watch(
  () => props.open,
  (v) => (isOpen.value = !!v),
);
watch(isOpen, (v) => emit("update:open", v));

const getOrgLabel = (org: any) => {
  try {
    if (org?.name && typeof useGetTranslation === "function") {
      return useGetTranslation(org.name);
    }
  } catch {}
  // fallback:
  return org?.name?.uz || org?.name?.en || org?.name?.ru || `ID: ${org?.id}`;
};

const fetchOrganizations = async () => {
  orgError.value = "";
  orgLoading.value = true;
  try {
    const { data } = await api.get("/organizations", {
      params: { page: 1, size: 1000 },
    });

    organizations.value = data?.data?.data ?? data?.data ?? [];
  } catch (e: any) {
    orgError.value =
      e.response?.data?.message || "Organization yuklashda xatolik";
  } finally {
    orgLoading.value = false;
  }
};

onMounted(() => {
  fetchOrganizations();
});

const triggerUpload = () => {
  if (imageUploading.value) return;
  uploadRef.value?.$el.querySelector('input[type="file"]')?.click();
};

const handleImageChange = async (file: UploadFile) => {
  if (!file.raw) return;

  if (file.raw.size > 5 * 1024 * 1024) {
    return ElMessage.error(t("messages.fileTooLarge") || "Max 5MB");
  }
  if (!file.raw.type.startsWith("image/")) {
    return ElMessage.error("Faqat rasm");
  }

  const reader = new FileReader();
  reader.onload = (e) => (imagePreview.value = e.target?.result as string);
  reader.readAsDataURL(file.raw);

  try {
    imageUploading.value = true;
    const formData = new FormData();
    formData.append("file", file.raw);

    const res = await api.post("/files", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    uploadedImagePath.value = res.data?.data?.path || res.data?.path;
    ElMessage.success(t("messages.imageUploaded") || "Yuklandi");
  } catch (error: any) {
    imagePreview.value = "";
    uploadedImagePath.value = "";
    ElMessage.error(error.response?.data?.message || "Xatolik");
  } finally {
    imageUploading.value = false;
  }
};

const clearImage = () => {
  imagePreview.value = "";
  uploadedImagePath.value = "";
};

const onSubmit = async () => {
  if (!formRef.value || imageUploading.value) return;

  try {
    await formRef.value.validate();
    saveLoading.value = true;

    const payload: any = {
      fullName: formState.value.fullName,
      username: formState.value.username,
      role: formState.value.role,
      image: uploadedImagePath.value || null,
      organizationId: formState.value.organizationId, // ✅
    };

    // create mode'da password majburiy, edit'da ixtiyoriy
    if (formState.value.password) payload.password = formState.value.password;

    if (props.isEditMode && props.editData?.id) {
      await api.put(`/user/${props.editData.id}`, payload);
      ElMessage.success(t("messages.updateSuccess") || "Yangilandi");
    } else {
      await api.post("/user", payload);
      ElMessage.success(t("messages.createSuccess") || "Yaratildi");
    }

    emit("save");
    isOpen.value = false;
  } catch (e: any) {
    ElMessage.error(e.response?.data?.message || "Xatolik");
  } finally {
    saveLoading.value = false;
  }
};

const onCancel = () => {
  if (!saveLoading.value) isOpen.value = false;
};

watch(isOpen, (val) => {
  if (!val) return;

  // org list bo'lmasa ham, modal ochilganda qayta chaqirib qo'yamiz
  if (!organizations.value.length) fetchOrganizations();

  if (props.isEditMode && props.editData) {
    formState.value = {
      fullName: props.editData.fullName || "",
      username: props.editData.username || "",
      password: "",
      image: props.editData.image || "",
      role: props.editData.role || UserRole.USER,
      organizationId: props.editData.organizationId ?? null,
    };

    imagePreview.value = props.editData.image
      ? toFileUrl(props.editData.image)
      : "";

    uploadedImagePath.value = props.editData.image || "";
  } else {
    formState.value = {
      fullName: "",
      username: "",
      password: "",
      image: "",
      role: UserRole.USER,
      organizationId: null,
    };
    imagePreview.value = "";
    uploadedImagePath.value = "";
  }

  formRef.value?.clearValidate();
});
</script>

<style scoped>
/* Dialog shell */
:deep(.el-dialog) {
  @apply !rounded-2xl overflow-hidden;
}

/* Header / Footer padding template orqali */
:deep(.el-dialog__header) {
  @apply !p-0;
}
:deep(.el-dialog__footer) {
  @apply !p-0;
}

/* ✅ Modal qotadi: body scroll */
:deep(.el-dialog__body) {
  @apply !p-0 overflow-hidden;
}

/* ✅ faqat ichidagi body-scroll scroll bo‘ladi */
.body-scroll {
  max-height: 60vh;
  overflow-y: auto;
}

/* footer */
.footer-bar {
  @apply flex items-center justify-end gap-3 py-2;
}

/* label */
:deep(.el-form-item__label) {
  @apply text-gray-700 dark:text-gray-300 font-medium select-none;
}
</style>
