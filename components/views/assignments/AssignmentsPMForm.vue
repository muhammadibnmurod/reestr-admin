<template>
  <el-dialog
    v-model="openModel"
    width="650px"
    destroy-on-close
    append-to-body
    class="assign-dialog-fixed"
    :close-on-click-modal="true"
  >
    <template #header>
      <div class="dlg-header">
        <div class="dlg-icon">
          <el-icon :size="20" class="text-white"><UserFilled /></el-icon>
        </div>
        <div class="flex-1">
          <h3
            class="text-xl font-bold text-gray-900 dark:text-white leading-tight"
          >
            PM biriktirish
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Loyiha uchun mas'ul menejerni (PM) tanlang
          </p>
        </div>
      </div>
    </template>

    <div class="dlg-body-scroll">
      <el-form label-position="top" @submit.prevent>
        <div class="card">
          <div class="card-title mb-6">
            <div class="card-ico-wrapper">
              <el-icon class="card-ico"><Avatar /></el-icon>
            </div>
            <div>
              <div class="ttl">Loyiha menejeri</div>
              <div class="sub">Xodimlar ro'yxatidan PMni tanlang</div>
            </div>
          </div>

          <el-form-item label="Xodimni tanlang" class="m-0">
            <el-select
              v-model="selectedEmployeeId"
              placeholder="Masalan: Aziz Azizov"
              filterable
              clearable
              class="w-full modern-select"
            >
              <el-option
                v-for="employee in allEmployees"
                :key="employee.id"
                :label="employee.fullnameuz || employee.fullNameUz || '-'"
                :value="employee.id"
              >
                <div class="flex items-center gap-3">
                  <el-avatar :size="24" :src="getImageUrl(employee.image)">
                    {{ (employee.fullnameuz || "U").charAt(0) }}
                  </el-avatar>
                  <span>{{ employee.fullnameuz || employee.fullNameUz }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <template #footer>
      <div class="dlg-footer">
        <el-button size="large" class="!px-8 !rounded-xl" @click="closeDialog">
          Bekor qilish
        </el-button>
        <el-button
          type="primary"
          size="large"
          class="!px-12 !rounded-xl shadow-lg"
          :loading="saving"
          @click="assignPm"
        >
          <el-icon class="mr-1"><Check /></el-icon>
          Biriktirish
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { UserFilled, Avatar, Check } from "@element-plus/icons-vue";
import api from "@/utils/axios";

const props = defineProps<{
  open: boolean;
  projectId: number;
  allEmployees: any[];
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

const getImageUrl = (path?: string) => {
  if (!path) return "";
  return path.startsWith("http")
    ? path
    : `https://reestr.das-uty.uz/api/${path}`;
};

watch(
  () => props.open,
  (v) => {
    if (!v) selectedEmployeeId.value = null;
  },
);

const closeDialog = () => {
  openModel.value = false;
};

const assignPm = async () => {
  if (!selectedEmployeeId.value) {
    ElMessage.warning("Iltimos, PM tanlang");
    return;
  }

  saving.value = true;
  try {
    const res = await api.get(`/project/${props.projectId}`);
    const p = res.data?.data ?? res.data;

    const payload = {
      nameUz: p.nameUz ?? "",
      nameRu: p.nameRu ?? "",
      nameEn: p.nameEn ?? "",
      nameKiril: p.nameKiril ?? "",
      descriptionUz: p.descriptionUz ?? "",
      descriptionRu: p.descriptionRu ?? "",
      descriptionEn: p.descriptionEn ?? "",
      descriptionKiril: p.descriptionKiril ?? "",
      logo: p.logo ?? "",
      startDate: p.startDate ?? "",
      endDate: p.endDate ?? "",
      status: p.status ?? "pending",
      price: p.price ?? 0,
      pmId: selectedEmployeeId.value,
    };

    await api.put(`/project/${props.projectId}`, payload);
    ElMessage.success("PM muvaffaqiyatli biriktirildi");
    emit("assigned");
    closeDialog();
  } catch (e: any) {
    ElMessage.error("PM biriktirishda xatolik yuz berdi");
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.assign-dialog-fixed :deep(.el-dialog) {
  @apply bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  margin: auto !important;
}

.assign-dialog-fixed :deep(.el-dialog__header),
.assign-dialog-fixed :deep(.el-dialog__footer) {
  @apply !p-0;
  flex-shrink: 0;
}

.assign-dialog-fixed :deep(.el-dialog__body) {
  @apply !p-0;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.dlg-header {
  @apply flex items-center gap-4 px-8 py-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900;
}

.dlg-icon {
  @apply w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg;
}

.dlg-body-scroll {
  @apply px-10 py-8;
  flex: 1;
  overflow-y: auto;
}

/* Card Style */
.card {
  @apply rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 p-6;
}
.card-title {
  @apply flex items-center gap-3;
}
.card-ico-wrapper {
  @apply w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700;
}
.card-ico {
  @apply text-blue-600 dark:text-blue-400 text-lg;
}
.ttl {
  @apply text-[15px] font-bold text-gray-900 dark:text-white leading-none;
}
.sub {
  @apply text-[11px] text-gray-500 dark:text-gray-400 mt-1;
}

/* Select Dizayni (1:1) */
.modern-select :deep(.el-select__wrapper) {
  @apply !rounded-xl !shadow-none bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 h-12 px-4 transition-all;
}
.modern-select :deep(.el-select__wrapper.is-focused) {
  @apply border-blue-500 ring-4 ring-blue-500/10;
}

:deep(.el-form-item__label) {
  @apply text-sm font-bold text-gray-900 dark:text-white leading-none mb-3 ml-1;
}

.dlg-footer {
  @apply flex items-center justify-end gap-4 px-8 py-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20;
}
.m-0 {
  margin-bottom: 0 !important;
}
</style>
