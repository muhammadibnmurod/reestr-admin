<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col min-h-0"
  >
    <!-- header -->
    <div
      class="p-6 border-b border-gray-200/60 dark:border-gray-700/60 flex-shrink-0"
    >
      <div class="flex items-start justify-between gap-4">
        <div>
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">
            Documents
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Project hujjatlari ro‘yxati (Main / Extra), yuklash va amallar
          </p>
        </div>

        <el-button
          v-if="!readonly"
          type="primary"
          class="!rounded-xl"
          :icon="Plus"
          @click="uploadOpen = true"
        >
          Hujjat yuklash
        </el-button>

        <!-- ✅ v-if olib tashlandi: modal doim DOMda tursin -->
        <ProjectDocumentsUpload
          v-model:open="uploadOpen"
          :project-id="projectId"
          @uploaded="refresh"
        />
      </div>

      <!-- filter + tabs -->
      <div class="mt-4 flex flex-col md:flex-row md:items-center gap-3">
        <el-input
          v-model="search"
          clearable
          placeholder="Qidirish... (nom bo‘yicha)"
          class="max-w-md"
          @clear="search = ''"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <el-tabs v-model="activeTab" type="card" class="ml-0 md:ml-auto">
          <el-tab-pane name="main" label="Main documents" />
          <el-tab-pane name="extra" label="Extra documents" />
        </el-tabs>
      </div>
    </div>

    <!-- list -->
    <div class="flex-1 min-h-0 overflow-y-auto p-6 pt-4">
      <ProjectDocumentsList
        :items="activeTab === 'main' ? filteredMain : filteredExtra"
        :loading="loading"
        :readonly="readonly"
        :downloading-id="downloadingId"
        @download="downloadDoc"
        @delete="confirmDelete"
        @attach="openAttach"
      />
    </div>

    <!-- ✅ main doc attach modal -->
    <ProjectMainDocAttach
      v-model:open="attachOpen"
      :project-id="projectId"
      :doc="attachRow"
      @uploaded="refresh"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, Search } from "@element-plus/icons-vue";
import api from "@/utils/axios";

import ProjectDocumentsUpload from "./ProjectDocumentsUpload.vue";
import ProjectDocumentsList from "./ProjectDocumentsList.vue";
import ProjectMainDocAttach from "./ProjectMainDocAttach.vue";

type DocItem = {
  id: number;
  nameUz?: string;
  nameRu?: string;
  nameEn?: string;
  nameKiril?: string;
  file?: string;
  given?: boolean;
  type?: "main" | "extra";
  category?: any;
};

const props = defineProps<{ readonly?: boolean }>();
const readonly = computed(() => !!props.readonly);

const route = useRoute();
const projectId = computed(() => Number(route.params.id));

const loading = ref(false);
const uploadOpen = ref(false);

const activeTab = ref<"main" | "extra">("main");
const search = ref("");

const mainItems = ref<DocItem[]>([]);
const extraItems = ref<DocItem[]>([]);
const downloadingId = ref<number | null>(null);

const attachOpen = ref(false);
const attachRow = ref<DocItem | null>(null);

const openAttach = (row: DocItem) => {
  attachRow.value = row;
  attachOpen.value = true;
};

const API = {
  main: (pid: number) => `/document/${pid}`,
  extra: (pid: number) => `/document/extra/${pid}`,
  delMain: (id: number) => `/document/${id}`,
  delExtra: (id: number) => `/document/extra/${id}`,
};

const fetchAll = async () => {
  loading.value = true;
  try {
    const [mRes, eRes] = await Promise.all([
      api.get(API.main(projectId.value)),
      api.get(API.extra(projectId.value)),
    ]);

    mainItems.value = (mRes.data?.data ?? []).map((x: any) => ({
      ...x,
      type: "main",
    }));
    extraItems.value = (eRes.data?.data ?? []).map((x: any) => ({
      ...x,
      type: "extra",
    }));
  } catch {
    ElMessage.error("Documentlarni yuklashda xatolik");
    mainItems.value = [];
    extraItems.value = [];
  } finally {
    loading.value = false;
  }
};

const refresh = async () => {
  await fetchAll();
};

onMounted(fetchAll);

const q = computed(() => search.value.trim().toLowerCase());

const filteredMain = computed(() => {
  if (!q.value) return mainItems.value;
  return mainItems.value.filter((d) =>
    [d.nameUz, d.nameEn, d.nameRu, d.nameKiril]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(q.value),
  );
});

const filteredExtra = computed(() => {
  if (!q.value) return extraItems.value;
  return extraItems.value.filter((d) =>
    [d.nameUz, d.nameEn, d.nameRu, d.nameKiril]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(q.value),
  );
});

const getFileUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `https://reestr.das-uty.uz/api/${path}`;
};

const bestTitle = (row: DocItem) =>
  row.nameUz || row.nameEn || row.nameRu || row.nameKiril || `#${row.id}`;

const downloadDoc = async (row: DocItem) => {
  const url = getFileUrl(row.file);
  if (!url) return ElMessage.warning("Fayl biriktirilmagan");

  downloadingId.value = row.id;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network error");
    const blob = await response.blob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = bestTitle(row);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch {
    ElMessage.error("Yuklab olishda xatolik");
  } finally {
    downloadingId.value = null;
  }
};

const confirmDelete = async (row: DocItem) => {
  if (readonly.value) return;

  try {
    await ElMessageBox.confirm("Hujjatni o‘chirmoqchimisiz?", "Ogohlantirish", {
      type: "warning",
      confirmButtonText: "Ha",
      cancelButtonText: "Yo‘q",
    });

    if (row.type === "extra") await api.delete(API.delExtra(row.id));
    else await api.delete(API.delMain(row.id));

    ElMessage.success("O‘chirildi");
    refresh();
  } catch {}
};
</script>
