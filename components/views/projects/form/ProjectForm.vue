<template>
  <el-form
    ref="formRef"
    :model="model"
    :rules="rules"
    label-position="top"
    size="large"
    class="project-form"
    :disabled="mode === 'view'"
  >
    <!-- Logo + quick info -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6">
      <div
        class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Logo
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Loyiha uchun logo yuklang
          </p>
        </div>

        <ProjectLogoUpload v-model="model.logo" :disabled="mode === 'view'" />
      </div>
    </div>

    <!-- Names -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Nomi
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">4 ta til</p>
        </div>
      </div>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="O'zbekcha" name="uz">
          <el-form-item label="Nomi (UZ) *" prop="nameUz">
            <el-input
              v-model="model.nameUz"
              placeholder="Loyiha nomi..."
              clearable
            />
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="English" name="en">
          <el-form-item label="Name (EN) *" prop="nameEn">
            <el-input
              v-model="model.nameEn"
              placeholder="Project name..."
              clearable
            />
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="Русский" name="ru">
          <el-form-item label="Название (RU) *" prop="nameRu">
            <el-input
              v-model="model.nameRu"
              placeholder="Название..."
              clearable
            />
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="Кирилл" name="kiril">
          <el-form-item label="Номи (KIRIL) *" prop="nameKiril">
            <el-input
              v-model="model.nameKiril"
              placeholder="Номи..."
              clearable
            />
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- Descriptions -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6">
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Tavsif
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">4 ta til</p>
      </div>

      <el-tabs v-model="descTab">
        <el-tab-pane label="O'zbekcha" name="uz">
          <el-form-item label="Tavsif (UZ) *" prop="descriptionUz">
            <el-input
              v-model="model.descriptionUz"
              type="textarea"
              :rows="4"
              placeholder="Tavsif..."
            />
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="English" name="en">
          <el-form-item label="Description (EN)" prop="descriptionEn">
            <el-input
              v-model="model.descriptionEn"
              type="textarea"
              :rows="4"
              placeholder="Description..."
            />
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="Русский" name="ru">
          <el-form-item label="Описание (RU)" prop="descriptionRu">
            <el-input
              v-model="model.descriptionRu"
              type="textarea"
              :rows="4"
              placeholder="Описание..."
            />
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="Кирилл" name="kiril">
          <el-form-item label="Тавсиф (KIRIL)" prop="descriptionKiril">
            <el-input
              v-model="model.descriptionKiril"
              type="textarea"
              :rows="4"
              placeholder="Тавсиф..."
            />
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- Meta -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Meta
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Muddat, status, PM, narx
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <el-form-item label="Boshlanish sanasi *" prop="startDate">
          <el-date-picker
            v-model="model.startDate"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DDTHH:mm:ss.SSS[Z]"
            placeholder="Tanlang"
            class="w-full"
          />
        </el-form-item>

        <el-form-item label="Tugash sanasi *" prop="endDate">
          <el-date-picker
            v-model="model.endDate"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DDTHH:mm:ss.SSS[Z]"
            placeholder="Tanlang"
            class="w-full"
          />
        </el-form-item>

        <el-form-item label="Status *" prop="status">
          <el-select
            v-model="model.status"
            class="w-full"
            placeholder="Tanlang"
          >
            <el-option
              v-for="s in statusOptions"
              :key="s.value"
              :label="s.label"
              :value="s.value"
            />
          </el-select>
        </el-form-item>

        <!-- PM: hozircha ID bilan -->
        <!-- PM Select -->
        <el-form-item label="PM *" prop="pmId">
          <el-select
            v-model="model.pmId"
            class="w-full"
            filterable
            clearable
            placeholder="PM tanlang"
            :loading="employeesLoading"
          >
            <el-option
              v-for="emp in employees || []"
              :key="emp.id"
              :label="
                emp.fullNameUz ||
                emp.fullName ||
                emp.username ||
                `Employee #${emp.id}`
              "
              :value="emp.id"
            >
              <div class="flex items-center gap-2">
                <el-avatar
                  :size="26"
                  :src="getImage(emp.image)"
                  class="border border-gray-200 dark:border-gray-700"
                />
                <div class="flex flex-col leading-tight">
                  <span class="text-sm">
                    {{
                      emp.fullNameUz ||
                      emp.fullName ||
                      emp.username ||
                      `Employee #${emp.id}`
                    }}
                  </span>
                </div>
              </div>
            </el-option>
          </el-select>

          <p class="text-xs text-gray-400 mt-1">
            Tanlangan PM ning ID si payloadga <b>pmId</b> bo‘lib yuboriladi.
          </p>
        </el-form-item>

        <el-form-item label="Narx" prop="price" class="md:col-span-2">
          <el-input-number
            v-model="model.price"
            class="!w-full"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
      </div>

      <!-- Actions -->
      <div
        class="flex items-center justify-end gap-3 mt-6 border-t border-gray-200 dark:border-gray-700 pt-4"
      >
        <el-button size="large" @click="$emit('cancel')" :disabled="loading">
          Bekor qilish
        </el-button>

        <el-button
          v-if="mode !== 'view'"
          type="primary"
          size="large"
          :loading="loading"
          @click="$emit('submit')"
          class="!px-8"
        >
          {{ mode === "edit" ? "Saqlash" : "Yaratish" }}
        </el-button>
      </div>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { FormInstance } from "element-plus";
import ProjectLogoUpload from "./ProjectLogoUpload.vue";

type Mode = "create" | "edit" | "view";

const props = defineProps<{
  modelValue: any;
  mode: Mode;
  loading?: boolean;

  employees?: Array<any>;
  employeesLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: any): void;
  (e: "submit"): void;
  (e: "cancel"): void;
}>();

const formRef = ref<FormInstance>();

const model = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const activeTab = ref<"uz" | "en" | "ru" | "kiril">("uz");
const descTab = ref<"uz" | "en" | "ru" | "kiril">("uz");

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Started", value: "started" },
  { label: "Completed", value: "completed" },
];

const getImage = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `https://reestr.das-uty.uz/api/${path}`;
};

const rules = {
  nameUz: [{ required: true, message: "Majburiy", trigger: "blur" }],
  nameEn: [{ required: true, message: "Majburiy", trigger: "blur" }],
  nameRu: [{ required: true, message: "Majburiy", trigger: "blur" }],
  nameKiril: [{ required: true, message: "Majburiy", trigger: "blur" }],

  descriptionUz: [{ required: true, message: "Majburiy", trigger: "blur" }],

  logo: [{ required: true, message: "Logo majburiy", trigger: "change" }],

  startDate: [{ required: true, message: "Majburiy", trigger: "change" }],
  endDate: [{ required: true, message: "Majburiy", trigger: "change" }],

  status: [{ required: true, message: "Majburiy", trigger: "change" }],
  pmId: [{ required: true, message: "Majburiy", trigger: "change" }],
};

const validate = async () => {
  if (!formRef.value) return false;
  try {
    await formRef.value.validate();
    return true;
  } catch {
    return false;
  }
};

defineExpose({ validate });
</script>

<style scoped>
.project-form :deep(.el-form-item__label) {
  @apply text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2;
}

.project-form :deep(.el-input__wrapper),
.project-form :deep(.el-textarea__inner),
.project-form :deep(.el-select__wrapper) {
  @apply shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700;
  @apply hover:border-blue-400 focus-within:border-blue-500 transition-all duration-200;
}

.project-form :deep(.el-input__wrapper.is-focus),
.project-form :deep(.el-select__wrapper.is-focus),
.project-form :deep(.el-textarea__inner:focus) {
  @apply shadow-md ring-2 ring-blue-100 dark:ring-blue-900/50;
}
</style>
