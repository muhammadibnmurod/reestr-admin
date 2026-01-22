<template>
  <div class="flex flex-col gap-6 h-full p-6 bg-gray-50 dark:bg-gray-900" v-loading="pageLoading">
    <!-- Header -->
    <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-4">
        <el-button
          :icon="ArrowLeft"
          circle
          @click="goBack"
          size="large"
        />
        <div>
          <h1 class="text-black dark:text-white text-3xl font-inter font-bold">
            Taqdimotni tahrirlash
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Taqdimot ma'lumotlarini o'zgartirish
          </p>
        </div>
      </div>
    </div>

    <!-- Form Content -->
    <div class="flex-1 overflow-y-auto" v-if="!pageLoading">
      <div class="max-w-6xl mx-auto">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
          size="large"
          class="modern-form"
        >
          <!-- Images Section -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Rasmlar
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <el-form-item label="Logo *" prop="logo">
                <PresentationImageUpload
                  v-model="form.logo"
                  :initial-preview="form.logo"
                  upload-type="logo"
                />
              </el-form-item>
              <el-form-item label="Banner rasm *" prop="image">
                <PresentationImageUpload
                  v-model="form.image"
                  :initial-preview="form.image"
                  upload-type="image"
                />
              </el-form-item>
            </div>
          </div>

          <!-- Color Section -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Rang
            </h3>
            <el-form-item label="Rang *" prop="color">
              <PresentationColorPicker v-model="form.color" />
            </el-form-item>
          </div>

          <!-- Form Fields Section -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Asosiy ma'lumotlar
            </h3>
            <PresentationFormFields v-model="form" />
          </div>

          <!-- Features Section -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
            <PresentationFeaturesManager v-model="form.features" />
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-end gap-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky bottom-0">
            <el-button size="large" @click="goBack" class="px-8">
              Bekor qilish
            </el-button>
            <el-button
              type="primary"
              size="large"
              @click="onSubmit"
              :loading="loading"
              class="px-8"
            >
              <template #icon>
                <el-icon><Check /></el-icon>
              </template>
              Saqlash
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElNotification } from "element-plus";
import type { FormInstance } from "element-plus";
import { ArrowLeft, Check } from "@element-plus/icons-vue";
import api from "@/utils/axios";
import type { PresentationFormData, Presentation } from "@/types";

const router = useRouter();
const route = useRoute();
const formRef = ref<FormInstance>();
const loading = ref(false);
const pageLoading = ref(true);

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

const fetchPresentation = async () => {
  const id = route.params.id;
  pageLoading.value = true;
  
  try {
    const response = await api.get(`/presentation/${id}`);
    const data: Presentation = response.data.data;
    
    form.value = {
      titleUz: data.titleUz || "",
      titleRu: data.titleRu || "",
      titleEn: data.titleEn || "",
      titleKiril: data.titleKiril || "",
      subtitleUz: data.subtitleUz || "",
      subtitleRu: data.subtitleRu || "",
      subtitleEn: data.subtitleEn || "",
      subtitleKiril: data.subtitleKiril || "",
      descriptionTitleUz: data.descriptionTitleUz || "",
      descriptionTitleRu: data.descriptionTitleRu || "",
      descriptionTitleEn: data.descriptionTitleEn || "",
      descriptionTitleKiril: data.descriptionTitleKiril || "",
      descriptionUz: data.descriptionUz || "",
      descriptionRu: data.descriptionRu || "",
      descriptionEn: data.descriptionEn || "",
      descriptionKiril: data.descriptionKiril || "",
      color: data.color || "#2563eb",
      image: data.image || "",
      logo: data.logo || "",
      features: data.features || [],
    };
  } catch (error: any) {
    ElNotification({
      title: 'Xatolik',
      message: error.response?.data?.message || 'Taqdimotni yuklashda xatolik',
      type: 'error',
      position: 'top-right'
    });
    goBack();
  } finally {
    pageLoading.value = false;
  }
};

onMounted(() => {
  fetchPresentation();
});

const goBack = () => {
  router.push({ name: 'presentations' });
};

const onSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return;

    if (form.value.features.length === 0) {
      ElMessage.warning("Kamida bitta xususiyat qo'shish kerak");
      return;
    }

    loading.value = true;
    try {
      const payload = {
        ...form.value,
        features: form.value.features.map((feature, index) => ({
          titleUz: feature.titleUz,
          titleRu: feature.titleRu,
          titleEn: feature.titleEn,
          titleKiril: feature.titleKiril,
          descriptionUz: feature.descriptionUz,
          descriptionRu: feature.descriptionRu,
          descriptionEn: feature.descriptionEn,
          descriptionKiril: feature.descriptionKiril,
          icon: feature.icon,
          order: index + 1,
        })),
      };

      const id = route.params.id;
      await api.put(`/presentation/${id}`, payload);
      ElMessage.success("Taqdimot muvaffaqiyatli yangilandi");
      router.push({ name: 'presentations' });
    } catch (error: any) {
      ElMessage.error(error.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      loading.value = false;
    }
  });
};
</script>

<style scoped>
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