<template>
  <el-dialog
    v-model="openModel"
    width="1000px"
    destroy-on-close
    append-to-body
    class="assign-emp-dialog-fixed"
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
            Xodim qo‘shish
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Loyiha jamoasini shakllantirish uchun xodimlarni tanlang
          </p>
        </div>
      </div>
    </template>

    <div class="dlg-body-scroll">
      <div class="card mb-6">
        <div class="flex items-center gap-4">
          <el-input
            v-model="q"
            clearable
            placeholder="Xodim ismini kiriting (F.I.O)..."
            class="modern-inp flex-1"
            @keyup.enter="onSearch"
            @clear="onClear"
          >
            <template #prefix>
              <el-icon class="text-gray-400"><Search /></el-icon>
            </template>
          </el-input>

          <el-button
            type="primary"
            size="large"
            class="!rounded-xl !px-8 shadow-md"
            :loading="loading"
            @click="onSearch"
          >
            Qidirish
          </el-button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div class="lg:col-span-3 card !p-0 overflow-hidden flex flex-col">
          <div
            class="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50"
          >
            <span
              class="text-xs font-bold text-gray-500 uppercase tracking-wider"
              >Xodimlar ro'yxati</span
            >
          </div>

          <el-table
            :data="rows"
            v-loading="loading"
            row-key="id"
            class="modern-table"
            :row-class-name="rowClass"
            height="400"
          >
            <el-table-column label="Xodim" min-width="280">
              <template #default="{ row }">
                <div class="flex items-center gap-3 py-1">
                  <el-avatar
                    :size="38"
                    :src="getImageUrl(row.image)"
                    class="shadow-sm border border-gray-100 dark:border-gray-700"
                  >
                    {{ (row.fullNameUz || "U").charAt(0) }}
                  </el-avatar>

                  <div class="min-w-0">
                    <div
                      class="font-bold text-[13px] text-gray-900 dark:text-white truncate"
                    >
                      {{ row.fullNameUz || row.fullnameuz || "-" }}
                    </div>
                    <div
                      class="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5"
                    >
                      {{ row.positionUz || row.positionuz || "-" }}
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="Holat" width="120" align="center">
              <template #default="{ row }">
                <span
                  v-if="isAssigned(row.id)"
                  class="text-[10px] font-bold px-2 py-1 rounded-md bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 uppercase"
                >
                  Biriktirilgan
                </span>
                <span
                  v-else
                  class="text-[10px] font-bold px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-400 uppercase"
                >
                  Bo'sh
                </span>
              </template>
            </el-table-column>

            <el-table-column
              label="Amal"
              width="100"
              align="center"
              fixed="right"
            >
              <template #default="{ row }">
                <el-button
                  type="primary"
                  link
                  class="font-bold"
                  :disabled="isAssigned(row.id)"
                  @click="pick(row)"
                >
                  Tanlash
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div
            class="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/30"
          >
            <el-pagination
              v-model:current-page="page"
              v-model:page-size="size"
              small
              background
              layout="prev, pager, next"
              :total="total"
              @current-change="fetchEmployees"
            />
          </div>
        </div>

        <div class="lg:col-span-2 flex flex-col gap-4">
          <div class="card h-full flex flex-col">
            <div class="card-title mb-6">
              <div class="card-ico-wrapper">
                <el-icon class="card-ico"><Check /></el-icon>
              </div>
              <div>
                <div class="ttl">Tanlangan xodim</div>
                <div class="sub">Tasdiqlashdan oldin tekshiring</div>
              </div>
            </div>

            <div
              v-if="selected"
              class="flex-1 flex flex-col justify-center items-center text-center p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-900/10"
            >
              <el-avatar
                :size="80"
                :src="getImageUrl(selected.image)"
                class="shadow-lg border-4 border-white dark:border-gray-800 mb-4"
              />
              <div
                class="font-bold text-lg text-gray-900 dark:text-white leading-tight"
              >
                {{ selected.fullNameUz || selected.fullnameuz || "-" }}
              </div>
              <div
                class="text-sm text-blue-600 dark:text-blue-400 font-medium mt-2"
              >
                {{ selected.positionUz || selected.positionuz || "-" }}
              </div>
            </div>

            <div
              v-else
              class="flex-1 flex flex-col justify-center items-center p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-center"
            >
              <div
                class="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-4"
              >
                <el-icon :size="24" class="text-gray-300"
                  ><UserFilled
                /></el-icon>
              </div>
              <div class="text-sm font-bold text-gray-400">
                Xodim tanlanmagan
              </div>
              <p class="text-[11px] text-gray-400 mt-2 leading-relaxed">
                Ro'yxatdan kerakli xodimni toping va "Tanlash" tugmasini bosing
              </p>
            </div>
          </div>
        </div>
      </div>
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
          :disabled="!selected"
          :loading="saving"
          @click="submit"
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
import { Search, UserFilled, Check } from "@element-plus/icons-vue";
import api from "@/utils/axios";

const props = defineProps<{
  open: boolean;
  projectId: number;
  projectEmployees: any[];
}>();

const emit = defineEmits<{
  (e: "update:open", v: boolean): void;
  (e: "assigned"): void;
  (e: "picked", employee: any): void;
}>();

const openModel = computed({
  get: () => props.open,
  set: (v) => emit("update:open", v),
});

const loading = ref(false);
const saving = ref(false);
const rows = ref<any[]>([]);
const total = ref(0);
const page = ref(1);
const size = ref(10);
const q = ref("");
const selected = ref<any | null>(null);

const assignedIds = computed(() =>
  (props.projectEmployees || []).map((e: any) => e.id),
);
const isAssigned = (id: number) => assignedIds.value.includes(id);

const rowClass = ({ row }: any) => {
  if (selected.value?.id === row.id) return "picked-row";
  if (isAssigned(row.id)) return "disabled-row";
  return "modern-row";
};

const fetchEmployees = async () => {
  loading.value = true;
  try {
    const res = await api.get("/employee", {
      params: {
        page: page.value,
        size: size.value,
        "full-name": q.value.trim() || undefined,
      },
    });
    const payload = res.data?.data ?? {};
    rows.value = payload.data ?? [];
    total.value = payload.total ?? 0;
  } catch (e) {
    ElMessage.error("Xodimlarni yuklashda xatolik");
  } finally {
    loading.value = false;
  }
};

const onSearch = () => {
  page.value = 1;
  fetchEmployees();
};
const onClear = () => {
  q.value = "";
  onSearch();
};
const pick = (row: any) => {
  if (!isAssigned(row.id)) selected.value = row;
};
const closeDialog = () => {
  openModel.value = false;
};

const submit = async () => {
  if (!selected.value?.id) return;
  saving.value = true;
  try {
    await api.post("/assignment/project", {
      projectId: props.projectId,
      employeeId: selected.value.id,
    });
    ElMessage.success("Xodim muvaffaqiyatli biriktirildi");
    emit("assigned");
    closeDialog();
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.message || "Xatolik");
  } finally {
    saving.value = false;
  }
};

watch(
  () => props.open,
  (v) => {
    if (v) {
      selected.value = null;
      page.value = 1;
      fetchEmployees();
    }
  },
);

const getImageUrl = (path?: string) => {
  if (!path) return "";
  return path.startsWith("http")
    ? path
    : `https://reestr.das-uty.uz/api/${path}`;
};
</script>

<style scoped>
.assign-emp-dialog-fixed :deep(.el-dialog) {
  @apply bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden;
  height: 85vh;
  display: flex;
  flex-direction: column;
  margin: auto !important;
}

.dlg-header {
  @apply flex items-center gap-4 px-8 py-6 border-b border-gray-100 dark:border-gray-800;
}

.dlg-icon {
  @apply w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg;
}

.dlg-body-scroll {
  @apply px-10 py-8 flex-1 overflow-y-auto;
}

/* Card Style */
.card {
  @apply rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 p-5;
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

/* Input Dizayni (1:1) */
.modern-inp :deep(.el-input__wrapper) {
  @apply !rounded-xl !shadow-none bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 h-12 px-4 transition-all;
}
.modern-inp :deep(.el-input__wrapper.is-focus) {
  @apply border-blue-500 ring-4 ring-blue-500/10;
}

/* Table Style */
.modern-table {
  @apply !bg-transparent;
}
:deep(.el-table__header th.el-table__cell) {
  @apply !bg-gray-50/50 dark:!bg-gray-900 !text-gray-500 text-[11px] font-bold uppercase py-3 border-b border-gray-100 dark:border-gray-800;
}
:deep(.el-table__row) {
  @apply !bg-transparent;
}
:deep(.el-table__cell) {
  @apply border-b border-gray-50 dark:border-gray-800/50;
}
:deep(.picked-row) {
  @apply !bg-blue-50/50 dark:!bg-blue-900/10;
}
:deep(.disabled-row) {
  @apply opacity-50 grayscale;
}

.dlg-footer {
  @apply flex items-center justify-end gap-4 px-8 py-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20;
}
</style>
