<template>
  <el-dialog
    v-model="openModel"
    :width="dialogWidth"
    destroy-on-close
    append-to-body
    class="assign-emp-dialog"
    :close-on-click-modal="true"
  >
    <template #header>
      <div class="dlg-header">
        <div class="dlg-icon">
          <el-icon :size="18" class="text-white"><UserFilled /></el-icon>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            Xodim qo‘shish
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Xodim tanlang va loyihaga biriktiring
          </p>
        </div>
      </div>
    </template>

    <!-- BODY: header/footer qotadi, body scroll -->
    <div class="dlg-body">
      <!-- Search -->
      <div class="flex items-center gap-2 mb-4">
        <el-input
          v-model="q"
          clearable
          placeholder="Qidirish... (F.I.O)"
          class="w-full"
          @keyup.enter="onSearch"
          @clear="onClear"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <el-button type="primary" class="!rounded-xl" :loading="loading" @click="onSearch">
          Qidirish
        </el-button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <!-- LEFT: List -->
        <div class="lg:col-span-3 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden bg-white dark:bg-[#1e222b]">
          <el-table
            :data="rows"
            v-loading="loading"
            row-key="id"
            stripe
            class="w-full"
            header-cell-class-name="tbl-head"
            :row-class-name="rowClass"
            height="420"
          >
            <el-table-column type="index" label="#" width="60" />

            <el-table-column label="Xodim" min-width="320">
              <template #default="{ row }">
                <div class="flex items-center gap-3">
                  <el-image
                    :src="getImageUrl(row.image)"
                    :preview-src-list="[getImageUrl(row.image)]"
                    fit="cover"
                    class="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 overflow-hidden"
                    preview-teleported
                  >
                    <template #error>
                      <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500">
                        U
                      </div>
                    </template>
                  </el-image>

                  <div class="min-w-0">
                    <div class="font-semibold text-gray-900 dark:text-white truncate">
                      {{ row.fullNameUz || row.fullnameuz || "-" }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {{ row.positionUz || row.positionuz || "-" }}
                    </div>
                  </div>

                  <span
                    v-if="isAssigned(row.id)"
                    class="ml-auto text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300"
                  >
                    Biriktirilgan
                  </span>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="Tanlash" width="120" align="center" fixed="right">
              <template #default="{ row }">
                <el-button
                  type="primary"
                  plain
                  class="!rounded-xl"
                  :disabled="isAssigned(row.id)"
                  @click="pick(row)"
                >
                  Tanlash
                </el-button>
              </template>
            </el-table-column>

            <template #empty>
              <div class="py-10 text-center">
                <div class="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Xodim topilmadi
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Qidiruvni o‘zgartiring yoki sahifani o‘zgartiring.
                </div>
              </div>
            </template>
          </el-table>

          <!-- Pagination -->
          <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <el-pagination
              v-model:current-page="page"
              v-model:page-size="size"
              :page-sizes="[10, 20, 50]"
              :total="total"
              layout="total, sizes, prev, pager, next"
              @current-change="fetchEmployees"
              @size-change="onSizeChange"
            />
          </div>
        </div>

        <!-- RIGHT: Selected form -->
        <div class="lg:col-span-2 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-[#1e222b] p-4">
          <div class="text-sm font-semibold text-gray-900 dark:text-white">
            Tanlangan xodim
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Tanlasangiz, ma’lumotlar shu yerda ko‘rinadi
          </div>

          <div v-if="selected" class="mt-4 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
            <div class="flex items-center gap-3">
              <el-image
                :src="getImageUrl(selected.image)"
                :preview-src-list="[getImageUrl(selected.image)]"
                fit="cover"
                class="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700 overflow-hidden"
                preview-teleported
              />
              <div class="min-w-0">
                <div class="font-bold text-gray-900 dark:text-white truncate">
                  {{ selected.fullNameUz || selected.fullnameuz || "-" }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                  {{ selected.positionUz || selected.positionuz || "-" }}
                </div>
              </div>
            </div>

            <!-- Form fields (kerak bo‘lsa) -->
            <el-form label-position="top" class="mt-4">
              <!-- <el-form-item label="Employee ID">
                <el-input :model-value="String(selected.id)" disabled />
              </el-form-item> -->

              <!-- xohlasang qo‘shimcha fieldlar -->
              <!-- <el-form-item label="Role (ixtiyoriy)">
                <el-input v-model="extra.role" placeholder="Masalan: Developer" />
              </el-form-item> -->
            </el-form>
          </div>

          <div v-else class="mt-4 p-6 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-center">
            <div class="text-sm text-gray-600 dark:text-gray-300 font-semibold">
              Hali tanlanmadi
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Chap tomondan xodimni “Tanlash” qiling
            </div>
          </div>
        </div>
      </div>
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
          :disabled="!selected"
          :loading="saving"
          @click="submit"
        >
          Biriktirish
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { Search, UserFilled } from "@element-plus/icons-vue";
import api from "@/utils/axios";

const props = defineProps<{
  open: boolean;
  projectId: number;

  /**
   * Loyihaga biriktirilgan employee list (GET /employee/{projectId})
   * shundan disable qilish uchun id larni olamiz.
   */
  projectEmployees: any[];
}>();

const emit = defineEmits<{
  (e: "update:open", v: boolean): void;
  (e: "assigned"): void;

  /**
   * Agar xohlasang: tanlangan employee’ni parentga “formga berib yuborish”
   * parent shu event orqali employee object/id ni oladi.
   */
  (e: "picked", employee: any): void;
}>();

const openModel = computed({
  get: () => props.open,
  set: (v) => emit("update:open", v),
});

const dialogWidth = computed(() => "min(1000px, 96vw)");

const loading = ref(false);
const saving = ref(false);

const rows = ref<any[]>([]);
const total = ref(0);
const page = ref(1);
const size = ref(10);
const q = ref("");

const selected = ref<any | null>(null);

const assignedIds = computed(() => (props.projectEmployees || []).map((e: any) => e.id));
const isAssigned = (id: number) => assignedIds.value.includes(id);

const rowClass = ({ row }: any) => {
  const picked = selected.value?.id === row.id;
  const disabled = isAssigned(row.id);
  if (picked) return "picked-row";
  if (disabled) return "disabled-row";
  return "tbl-row";
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
    rows.value = [];
    total.value = 0;
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
  page.value = 1;
  fetchEmployees();
};

const onSizeChange = (v: number) => {
  size.value = v;
  page.value = 1;
  fetchEmployees();
};

const pick = (row: any) => {
  if (isAssigned(row.id)) return;
  selected.value = row;
  emit("picked", row); // ✅ “tanlaganda formga berib yuborish”
};

const closeDialog = () => {
  openModel.value = false;
};

const submit = async () => {
  if (!selected.value?.id) {
    ElMessage.warning("Xodim tanlang");
    return;
  }

  saving.value = true;
  try {
    await api.post("/assignment/project", {
      projectId: props.projectId,
      employeeId: selected.value.id,
    });

    ElMessage.success("Xodim biriktirildi");
    emit("assigned");
    closeDialog();
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.message || "Biriktirishda xatolik");
  } finally {
    saving.value = false;
  }
};


watch(
  () => props.open,
  async (v) => {
    if (!v) return;
    // modal ochilganda refresh
    selected.value = null;
    page.value = 1;
    await fetchEmployees();
  },
);

const getImageUrl = (path?: string) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `https://reestr.das-uty.uz/api/${path}`;
};
</script>

<style scoped>
.assign-emp-dialog :deep(.el-dialog) {
  @apply bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  margin: auto !important;
}
.assign-emp-dialog :deep(.el-dialog__header),
.assign-emp-dialog :deep(.el-dialog__footer) {
  @apply !p-0;
  flex-shrink: 0;
}
.assign-emp-dialog :deep(.el-dialog__body) {
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

:deep(.tbl-head) {
  @apply bg-gray-50 dark:bg-[#0f172a] text-gray-600 dark:text-gray-300 font-semibold;
}
:deep(.el-table__header-wrapper th.el-table__cell) {
  @apply bg-gray-50 dark:bg-[#0f172a];
}
:deep(.tbl-row) td.el-table__cell {
  @apply border-gray-200 dark:border-gray-700;
}
:deep(.el-table__row--striped td.el-table__cell) {
  @apply dark:bg-white/5;
}
:deep(.el-table__body tr:hover > td.el-table__cell) {
  @apply bg-gray-50/60 dark:bg-white/10 transition-colors;
}

/* selected row */
:deep(.picked-row) td.el-table__cell {
  @apply bg-blue-500/10 dark:bg-blue-400/10;
}

/* assigned row (disabled look) */
:deep(.disabled-row) td.el-table__cell {
  @apply opacity-60;
}
</style>
