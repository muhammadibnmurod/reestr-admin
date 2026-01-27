<template>
  <el-dialog
    v-model="openModel"
    :width="dialogWidth"
    destroy-on-close
    append-to-body
    class="submodule-dialog"
    :close-on-click-modal="true"
  >
    <!-- Header (sticky) -->
    <template #header>
      <div class="dlg-header">
        <div class="dlg-icon">
          <el-icon :size="18" class="text-white">
            <component :is="editData?.id ? Edit : Plus" />
          </el-icon>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            {{ editData?.id ? "Submodule tahrirlash" : "Yangi submodule" }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Nom, status va muddatlarni kiriting
          </p>
        </div>
      </div>
    </template>

    <!-- Body scroll -->
    <div class="dlg-body">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-tabs v-model="tab" class="mb-4">
          <el-tab-pane label="O'zbekcha" name="uz">
            <el-form-item label="Name (UZ) *" prop="nameUz">
              <el-input v-model="form.nameUz" placeholder="Masalan: Login Page" />
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="English" name="en">
            <el-form-item label="Name (EN)" prop="nameEn">
              <el-input v-model="form.nameEn" placeholder="Name..." />
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="Русский" name="ru">
            <el-form-item label="Name (RU)" prop="nameRu">
              <el-input v-model="form.nameRu" placeholder="Название..." />
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="Кирилл" name="kr">
            <el-form-item label="Name (Kiril)" prop="nameKiril">
              <el-input v-model="form.nameKiril" placeholder="Номи..." />
            </el-form-item>
          </el-tab-pane>
        </el-tabs>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-200/70 dark:border-gray-700/70 pt-4">
          <el-form-item label="Status *" prop="status">
            <el-select v-model="form.status" class="w-full" placeholder="Tanlang">
              <el-option label="STARTED" value="STARTED" />
              <el-option label="IN_PROGRESS" value="IN_PROGRESS" />
              <el-option label="DONE" value="DONE" />
            </el-select>
          </el-form-item>

          <el-form-item label="Start date *" prop="startDate">
            <el-date-picker
              v-model="form.startDate"
              type="date"
              value-format="YYYY-MM-DD"
              class="w-full"
            />
          </el-form-item>

          <el-form-item label="End date *" prop="endDate">
            <el-date-picker
              v-model="form.endDate"
              type="date"
              value-format="YYYY-MM-DD"
              class="w-full"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>

    <!-- Footer (sticky) -->
    <template #footer>
      <div class="dlg-footer">
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
  moduleId: number;
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

const dialogWidth = computed(() => "min(920px, 94vw)");

const formRef = ref<FormInstance>();
const saving = ref(false);
const tab = ref<"uz" | "en" | "ru" | "kr">("uz");

const form = reactive({
  nameUz: "",
  nameRu: "",
  nameEn: "",
  nameKiril: "",
  status: "STARTED",
  startDate: "",
  endDate: "",
});

const rules = {
  nameUz: [{ required: true, message: "Majburiy", trigger: "blur" }],
  status: [{ required: true, message: "Majburiy", trigger: "change" }],
  startDate: [{ required: true, message: "Majburiy", trigger: "change" }],
  endDate: [{ required: true, message: "Majburiy", trigger: "change" }],
};

const reset = () => {
  form.nameUz = "";
  form.nameRu = "";
  form.nameEn = "";
  form.nameKiril = "";
  form.status = "STARTED";
  form.startDate = "";
  form.endDate = "";
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
      form.status = d.status || "STARTED";
      form.startDate = d.startDate || "";
      form.endDate = d.endDate || "";
    } else {
      reset();
    }
  }
);

const submit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    saving.value = true;

    const payload = {
      moduleId: props.moduleId,
      ...form,
    };

    if (props.editData?.id) {
      await api.put(`/submodule/${props.editData.id}`, payload);
      ElMessage.success("Submodule yangilandi");
    } else {
      await api.post("/submodule", payload);
      ElMessage.success("Submodule yaratildi");
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
.submodule-dialog :deep(.el-dialog) {
  @apply !rounded-2xl overflow-hidden;
  max-height: 86vh;
  display: flex;
  flex-direction: column;
}
.submodule-dialog :deep(.el-dialog__header),
.submodule-dialog :deep(.el-dialog__footer) {
  @apply !p-0;
  flex-shrink: 0;
}
.submodule-dialog :deep(.el-dialog__body) {
  @apply !p-0;
  flex: 1;
  min-height: 0;
  overflow: hidden; 
  display: flex;
  flex-direction: column;
}

.dlg-header {
  @apply flex items-center gap-3 px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900;
}
.dlg-icon {
  @apply w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg;
}
.dlg-body {
  @apply px-6 py-5;
  flex: 1;
  min-height: 0;
  overflow-y: auto; 
}
.dlg-footer {
  @apply flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50;
}

:deep(.el-form-item__label) {
  @apply text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2;
}
:deep(.el-input__wrapper),
:deep(.el-textarea__inner),
:deep(.el-date-editor),
:deep(.el-select__wrapper) {
  @apply !rounded-xl;
}
</style>
