<template>
  <el-dialog
    v-model="openModel"
    width="720px"
    destroy-on-close
    append-to-body
    class="assign-dialog"
    :close-on-click-modal="true"
  >
    <template #header>
      <div class="dlg-header">
        <div class="dlg-icon">
          <el-icon :size="18" class="text-white"><Plus /></el-icon>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            Xodim qo‘shish
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Loyihaga xodim biriktirish
          </p>
        </div>
      </div>
    </template>

    <div class="dlg-body">
      <el-form label-position="top">
        <el-form-item label="Xodim">
          <el-select
            v-model="selectedEmployeeId"
            placeholder="Xodim tanlang"
            filterable
            clearable
            class="w-full"
          >
            <el-option
              v-for="employee in availableEmployees"
              :key="employee.id"
              :label="employee.fullnameuz || employee.fullNameUz || '-'"
              :value="employee.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <div class="dlg-footer">
        <el-button size="large" class="!rounded-xl" @click="closeDialog">
          Bekor qilish
        </el-button>
        <el-button
          type="primary"
          size="large"
          class="!rounded-xl !px-8"
          :loading="saving"
          @click="addEmployee"
        >
          Qo‘shish
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import api from "@/utils/axios";

const props = defineProps<{
  open: boolean;
  projectId: number;
  allEmployees: any[];
  projectEmployees: any[];
}>();

const emit = defineEmits<{
  (e: "update:open", v: boolean): void;
  (e: "assigned"): void;
}>();

const openModel = computed({
  get: () => props.open,
  set: (v) => emit("update:open", v),
});

const selectedEmployeeId = ref<number | null>(null);
const saving = ref(false);

watch(
  () => props.open,
  (v) => {
    if (!v) selectedEmployeeId.value = null;
  }
);

const availableEmployees = computed(() => {
  const ids = (props.projectEmployees || []).map((e: any) => e.id);
  return (props.allEmployees || []).filter((e: any) => !ids.includes(e.id));
});

const closeDialog = () => {
  openModel.value = false;
};

const addEmployee = async () => {
  if (!selectedEmployeeId.value) {
    ElMessage.warning("Xodim tanlang");
    return;
  }

  saving.value = true;
  try {
    // ⚠️ assignment endpoint sendagi servisga bog‘liq.
    // Sizda swagger bo‘yicha: POST /api/assignment (projectId, employeeId) bo‘lsa:
    await api.post(`/assignment`, {
      projectId: props.projectId,
      employeeId: selectedEmployeeId.value,
    });

    ElMessage.success("Xodim qo‘shildi");
    emit("assigned");
    closeDialog();
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.message || "Xodim qo‘shishda xatolik");
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
/* xuddi PM dialog style */
.assign-dialog :deep(.el-dialog) {
  @apply bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden;
  max-height: 75vh;
  display: flex;
  flex-direction: column;
  margin: auto !important;
}
.assign-dialog :deep(.el-dialog__header),
.assign-dialog :deep(.el-dialog__footer) {
  @apply !p-0;
  flex-shrink: 0;
}
.assign-dialog :deep(.el-dialog__body) {
  @apply !p-0;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
.dlg-header {
  @apply flex items-center gap-3 px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900;
}
.dlg-icon {
  @apply w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg;
}
.dlg-body {
  @apply px-6 py-6;
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
:deep(.el-select__wrapper) {
  @apply shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700;
}
</style>
