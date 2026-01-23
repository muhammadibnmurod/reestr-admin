<template>
  <el-dialog v-model="isOpen" width="600px" height="auto" align-center append-to-body destroy-on-close>
    <template #header>
      <div class="flex items-center gap-3 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
          <el-icon :size="20" class="text-white">
            <component :is="isEditMode ? 'Edit' : 'Plus'" />
          </el-icon>
        </div>
        <div class="flex-1">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ isEditMode ? $t("user.editUser") : $t("user.createUser") }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ isEditMode ? $t("user.editDescription") : $t("user.createDescription") }}</p>
        </div>
      </div>
    </template>

    <div class="px-6 py-6 max-h-[70vh] overflow-y-auto">
      <el-form ref="formRef" size="large" label-position="top" :model="formState" @submit.prevent>
        <!-- Avatar -->
        <div class="mb-8 flex flex-col items-center">
          <div v-loading="imageUploading" class="relative">
            <div class="relative group">
              <el-avatar :size="120" :src="imagePreview || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'" 
                class="border-4 border-white dark:border-gray-800 shadow-xl" />
              <div v-if="!imageUploading" @click="triggerUpload"
                class="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer backdrop-blur-sm">
                <el-icon :size="32" class="text-white"><Camera /></el-icon>
              </div>
              <el-button v-if="uploadedImagePath && !imageUploading" circle type="danger" size="small" 
                class="!absolute -top-2 -right-2 shadow-lg hover:scale-110 transition-transform" @click="clearImage">
                <el-icon><Close /></el-icon>
              </el-button>
            </div>
          </div>
          <el-upload ref="uploadRef" :auto-upload="false" :show-file-list="false" accept="image/*" :on-change="handleImageChange" class="hidden">
            <el-button />
          </el-upload>
          <div class="mt-4 text-center">
            <el-button type="primary" link :icon="ElIconUpload" @click="triggerUpload" :disabled="imageUploading">
              {{ uploadedImagePath ? $t("user.changeImage") : $t("user.selectImage") }}
            </el-button>
            <p class="text-xs text-gray-400 mt-2">PNG, JPG (max 5MB)</p>
          </div>
        </div>

        <!-- Fields -->
        <div class="space-y-5">
          <el-form-item :label="$t('user.fullName')" prop="fullName" :rules="[{ required: true, message: t('messages.required') || 'Majburiy', trigger: 'blur' }]">
            <el-input v-model="formState.fullName" :prefix-icon="ElIconUser" clearable :placeholder="$t('user.fullNamePlaceholder') || 'Ismingizni kiriting'" />
          </el-form-item>

          <el-form-item :label="$t('user.username')" prop="username" :rules="[{ required: true, message: t('messages.required') || 'Majburiy', trigger: 'blur' }]">
            <el-input v-model="formState.username" :prefix-icon="ElIconUser" clearable :placeholder="$t('user.usernamePlaceholder') || 'Username kiriting'" />
          </el-form-item>

          <el-form-item :label="$t('user.password')" prop="password" :rules="isEditMode ? [] : [{ required: true, message: t('messages.required') || 'Majburiy', trigger: 'blur' }]">
            <el-input v-model="formState.password" type="password" show-password :prefix-icon="ElIconLock" clearable 
              :placeholder="isEditMode ? $t('user.passwordOptional') || 'Bo\'sh qoldiring' : $t('user.passwordPlaceholder') || 'Parol'" />
          </el-form-item>
        </div>
      </el-form>
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <el-button size="large" @click="onCancel" :disabled="saveLoading">{{ $t("common.cancel") }}</el-button>
        <el-button type="primary" size="large" @click="onSubmit" :loading="saveLoading" :disabled="imageUploading" class="!px-8">
          <template #icon><el-icon><Check /></el-icon></template>
          {{ isEditMode ? $t("common.update") : $t("common.save") }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, UploadFile, UploadInstance } from "element-plus";
import { User as ElIconUser, Lock as ElIconLock, Upload as ElIconUpload, Camera, Close, Check, Plus, Edit } from "@element-plus/icons-vue";
import api from "@/utils/axios";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const props = defineProps<{ open?: boolean; isEditMode?: boolean; editData?: any }>();
const emit = defineEmits<{ (e: 'save'): void; (e: 'update:open', value: boolean): void }>();

const isOpen = ref(!!props.open);
const formRef = ref<FormInstance>();
const uploadRef = ref<UploadInstance>();
const saveLoading = ref(false);
const imageUploading = ref(false);
const imagePreview = ref("");
const uploadedImagePath = ref("");
const formState = ref({ fullName: "", username: "", password: "" });

watch(() => props.open, (v) => isOpen.value = !!v);
watch(isOpen, (v) => emit("update:open", v));

const triggerUpload = () => {
  if (imageUploading.value) return;
  uploadRef.value?.$el.querySelector('input[type="file"]')?.click();
};

const handleImageChange = async (file: UploadFile) => {
  if (!file.raw) return;
  if (file.raw.size > 5 * 1024 * 1024) return ElMessage.error(t("messages.fileTooLarge") || "Max 5MB");
  if (!file.raw.type.startsWith('image/')) return ElMessage.error("Faqat rasm");

  const reader = new FileReader();
  reader.onload = (e) => imagePreview.value = e.target?.result as string;
  reader.readAsDataURL(file.raw);

  try {
    imageUploading.value = true;
    const formData = new FormData();
    formData.append("file", file.raw);
    const res = await api.post("/files", formData, { headers: { "Content-Type": "multipart/form-data" } });
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

const clearImage = () => { imagePreview.value = ""; uploadedImagePath.value = "" };

const onSubmit = async () => {
  if (!formRef.value || imageUploading.value) return;
  try {
    await formRef.value.validate();
    saveLoading.value = true;
    const payload: any = { fullName: formState.value.fullName, username: formState.value.username, image: uploadedImagePath.value || null };
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

const onCancel = () => { if (!saveLoading.value) isOpen.value = false };

watch(isOpen, (val) => {
  if (val) {
    if (props.isEditMode && props.editData) {
      formState.value = { fullName: props.editData.fullName || "", username: props.editData.username || "", password: "" };
      imagePreview.value = props.editData.image || "";
      uploadedImagePath.value = props.editData.image || "";
    } else {
      formState.value = { fullName: "", username: "", password: "" };
      imagePreview.value = "";
      uploadedImagePath.value = "";
    }
    formRef.value?.clearValidate();
  }
});
</script>