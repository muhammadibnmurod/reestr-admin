<template>
  <el-dialog
      v-model="openModel"
      width="720px"
      destroy-on-close
      append-to-body
      class="cat-dialog"
  >
    <template #header>
      <div class="hdr">
        <div class="icn">
          <el-icon :size="18" class="text-white">
            <component :is="isEditMode ? Edit : Plus" />
          </el-icon>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            {{ title }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {{ subtitle }}
          </p>
        </div>
      </div>
    </template>

    <div class="body">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-tabs v-model="tab" class="mb-2">
          <!-- UZ -->
          <el-tab-pane label="O‘zbekcha" name="uz">
            <el-form-item label="Nomi (UZ) *" prop="nameUz">
              <el-input v-model="form.nameUz" :disabled="isViewMode" placeholder="Masalan: Shartnoma" />
            </el-form-item>
          </el-tab-pane>

          <!-- EN -->
          <el-tab-pane label="English" name="en">
            <el-form-item label="Name (EN)" prop="nameEn">
              <el-input v-model="form.nameEn" :disabled="isViewMode" placeholder="For example: Contract" />
            </el-form-item>
          </el-tab-pane>

          <!-- RU -->
          <el-tab-pane label="Русский" name="ru">
            <el-form-item label="Название (RU)" prop="nameRu">
              <el-input v-model="form.nameRu" :disabled="isViewMode" placeholder="Например: Договор" />
            </el-form-item>
          </el-tab-pane>

          <!-- KR -->
          <el-tab-pane label="Кирилл" name="kr">
            <el-form-item label="Номи (Кирилл)" prop="nameKiril">
              <el-input v-model="form.nameKiril" :disabled="isViewMode" placeholder="Масалан: Шартнома" />
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>

    <template #footer>
      <div class="ftr">
        <el-button size="large" class="!rounded-xl" @click="openModel = false">
          Yopish
        </el-button>

        <el-button
            v-if="!isViewMode"
            type="primary"
            size="large"
            class="!rounded-xl !px-8"
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
import type { FormInstance } from "element-plus";
import { ElMessage } from "element-plus";
import { Plus, Edit } from "@element-plus/icons-vue";
import api from "@/utils/axios";

const props = defineProps<{
  open: boolean;
  isEditMode?: boolean;
  isViewMode?: boolean;
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

const isEditMode = computed(() => !!props.isEditMode && !!props.editData?.id);
const isViewMode = computed(() => !!props.isViewMode);

const title = computed(() =>
    isViewMode.value ? "Kategoriya" : isEditMode.value ? "Tahrirlash" : "Yangi kategoriya",
);
const subtitle = computed(() =>
    isViewMode.value ? "Ma’lumotlarni ko‘rish" : "Hujjat kategoriyasi nomlarini kiriting",
);

const formRef = ref<FormInstance>();
const saving = ref(false);

// ✅ tabs
const tab = ref<"uz" | "en" | "ru" | "kr">("uz");

const form = reactive({
  id: 0,
  nameUz: "",
  nameRu: "",
  nameEn: "",
  nameKiril: "",
});

const rules = {
  nameUz: [{ required: true, message: "Majburiy", trigger: "blur" }],
};

const reset = () => {
  form.id = 0;
  form.nameUz = "";
  form.nameRu = "";
  form.nameEn = "";
  form.nameKiril = "";
  tab.value = "uz";
  formRef.value?.clearValidate();
};

watch(
    () => props.open,
    (v) => {
      if (!v) return;

      if (props.editData?.id) {
        const d = props.editData;
        form.id = d.id;
        form.nameUz = d.nameUz || "";
        form.nameRu = d.nameRu || "";
        form.nameEn = d.nameEn || "";
        form.nameKiril = d.nameKiril || "";
        tab.value = "uz";
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

    const payload = {
      nameUz: form.nameUz,
      nameRu: form.nameRu,
      nameEn: form.nameEn,
      nameKiril: form.nameKiril,
    };

    if (isEditMode.value) {
      await api.put("/document-category", { ...payload, id: form.id });
      ElMessage.success("Yangilandi");
    } else {
      await api.post("/document-category", payload);
      ElMessage.success("Yaratildi");
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
.cat-dialog :deep(.el-dialog) {
  @apply bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden;
  max-height: 78vh;
  display: flex;
  flex-direction: column;
  margin: auto !important;
}
.cat-dialog :deep(.el-dialog__header),
.cat-dialog :deep(.el-dialog__footer) {
  @apply !p-0;
  flex-shrink: 0;
}
.cat-dialog :deep(.el-dialog__body) {
  @apply !p-0;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.hdr {
  @apply flex items-center gap-3 px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900;
}
.icn {
  @apply w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg;
}
.body {
  @apply px-6 py-6;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}
.ftr {
  @apply flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50;
}
:deep(.el-form-item__label) {
  @apply text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2;
}
</style>
