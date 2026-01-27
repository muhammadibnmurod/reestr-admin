<template>
  <el-dialog
    v-model="openModel"
    width="860px"
    destroy-on-close
    append-to-body
    class="module-dialog"
    :close-on-click-modal="true"
  >
    <template #header>
      <div
        class="flex items-center gap-3 px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
      >
        <div
          class="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg"
        >
          <el-icon :size="18" class="text-white">
            <component :is="editData?.id ? Edit : Plus" />
          </el-icon>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            {{ editData?.id ? "Modulni tahrirlash" : "Yangi modul" }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Modul nomi, tavsifi, muddat va rangini kiriting
          </p>
        </div>
      </div>
    </template>

    <!-- BODY (faqat shu joy scroll) -->
    <div class="dlg-body-scroll">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-tabs v-model="tab" class="mb-4">
          <el-tab-pane label="O'zbekcha" name="uz">
            <el-form-item label="Name (UZ) *" prop="nameUz">
              <el-input
                v-model="form.nameUz"
                placeholder="Masalan: Auth modul"
              />
            </el-form-item>
            <el-form-item label="Description (UZ) *" prop="descriptionUz">
              <el-input
                v-model="form.descriptionUz"
                type="textarea"
                :rows="3"
                placeholder="Modul tavsifi..."
              />
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="English" name="en">
            <el-form-item label="Name (EN)" prop="nameEn">
              <el-input v-model="form.nameEn" placeholder="Module name..." />
            </el-form-item>
            <el-form-item label="Description (EN)" prop="descriptionEn">
              <el-input
                v-model="form.descriptionEn"
                type="textarea"
                :rows="3"
              />
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="Русский" name="ru">
            <el-form-item label="Name (RU)" prop="nameRu">
              <el-input v-model="form.nameRu" placeholder="Название..." />
            </el-form-item>
            <el-form-item label="Description (RU)" prop="descriptionRu">
              <el-input
                v-model="form.descriptionRu"
                type="textarea"
                :rows="3"
              />
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="Кирилл" name="kr">
            <el-form-item label="Name (Kiril)" prop="nameKiril">
              <el-input v-model="form.nameKiril" placeholder="Номи..." />
            </el-form-item>
            <el-form-item label="Description (Kiril)" prop="descriptionKiril">
              <el-input
                v-model="form.descriptionKiril"
                type="textarea"
                :rows="3"
              />
            </el-form-item>
          </el-tab-pane>
        </el-tabs>

        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200/70 dark:border-gray-700/70 pt-4"
        >
          <el-form-item label="Start date" prop="startDate">
            <el-date-picker
              v-model="form.startDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="Boshlanish"
              class="w-full"
            />
          </el-form-item>

          <el-form-item label="End date" prop="endDate">
            <el-date-picker
              v-model="form.endDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="Tugash"
              class="w-full"
            />
          </el-form-item>
        </div>

        <el-form-item label="Color" prop="color" class="mt-2">
          <PresentationColorPicker v-model="form.color" />
        </el-form-item>
      </el-form>
    </div>

    <!-- FOOTER (qotadi) -->
    <template #footer>
      <div
        class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
      >
        <el-button class="!rounded-xl" size="large" @click="openModel = false">
          Bekor qilish
        </el-button>
        <el-button
          type="primary"
          class="!rounded-xl !px-8"
          size="large"
          :loading="saving"
          @click="submit"
        >
          Saqlash
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
import { Plus, Edit } from "@element-plus/icons-vue";
import api from "@/utils/axios";

const props = defineProps<{
  open: boolean;
  projectId: number;
  editData?: any | null;
}>();

const emit = defineEmits<{
  (e: "update:open", v: boolean): void;
  (e: "saved"): void;
}>();

const openModel = computed({
  get: () => props.open,
  set: (v) => emit("update:open", v),
});

const formRef = ref<FormInstance>();
const saving = ref(false);
const tab = ref<"uz" | "en" | "ru" | "kr">("uz");

const form = reactive({
  nameUz: "",
  nameRu: "",
  nameEn: "",
  nameKiril: "",
  descriptionUz: "",
  descriptionRu: "",
  descriptionEn: "",
  descriptionKiril: "",
  startDate: "",
  endDate: "",
  color: "yellow",
});

const rules = {
  nameUz: [{ required: true, message: "Majburiy", trigger: "blur" }],
  descriptionUz: [{ required: true, message: "Majburiy", trigger: "blur" }],
  startDate: [{ required: true, message: "Majburiy", trigger: "change" }],
  endDate: [{ required: true, message: "Majburiy", trigger: "change" }],
  color: [{ required: true, message: "Majburiy", trigger: "change" }],
};

const reset = () => {
  form.nameUz = "";
  form.nameRu = "";
  form.nameEn = "";
  form.nameKiril = "";
  form.descriptionUz = "";
  form.descriptionRu = "";
  form.descriptionEn = "";
  form.descriptionKiril = "";
  form.startDate = "";
  form.endDate = "";
  form.color = "yellow";
  tab.value = "uz";
  formRef.value?.clearValidate();
};

watch(
  () => props.open,
  (v) => {
    if (!v) return;

    if (props.editData?.id) {
      const d = props.editData;
      form.nameUz = d.nameUz || "";
      form.nameRu = d.nameRu || "";
      form.nameEn = d.nameEn || "";
      form.nameKiril = d.nameKiril || "";
      form.descriptionUz = d.descriptionUz || "";
      form.descriptionRu = d.descriptionRu || "";
      form.descriptionEn = d.descriptionEn || "";
      form.descriptionKiril = d.descriptionKiril || "";
      form.startDate = d.startDate || "";
      form.endDate = d.endDate || "";
      form.color = d.color || "yellow";
    } else {
      reset();
    }
  },
);

const submit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    saving.value = true;

    const payload = { projectId: props.projectId, ...form };

    if (props.editData?.id) {
      await api.put(`/module/${props.editData.id}`, payload);
      ElMessage.success("Modul yangilandi");
    } else {
      await api.post("/module", payload);
      ElMessage.success("Modul yaratildi");
    }

    emit("saved");
    openModel.value = false;
    reset();
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.message || "Xatolik yuz berdi");
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.module-dialog :deep(.el-dialog) {
  @apply !rounded-2xl overflow-hidden bg-white dark:bg-gray-900;
  max-height: 85vh; 
  display: flex;
  flex-direction: column;
  margin: auto !important;
}

.module-dialog :deep(.el-dialog__header),
.module-dialog :deep(.el-dialog__footer) {
  @apply !p-0;
  flex-shrink: 0;
}

.module-dialog :deep(.el-dialog__body) {
  @apply !p-0;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.dlg-body-scroll {
  @apply px-6 py-5;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

:deep(.el-form-item__label) {
  @apply text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2;
}
:deep(.el-input__wrapper),
:deep(.el-textarea__inner),
:deep(.el-date-editor) {
  @apply !rounded-xl;
}
</style>
