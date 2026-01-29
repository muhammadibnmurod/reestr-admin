<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col min-h-0"
  >
    <!-- header (qotadi) -->
    <div
      class="p-6 border-b border-gray-200/60 dark:border-gray-700/60 flex-shrink-0"
    >
      <div class="flex items-start justify-between gap-4">
        <div>
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">
            Documents
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Project hujjatlari ro‘yxati, yuklash va amallar
          </p>
        </div>

        <el-button v-if="!readonly" type="primary" @click="isUploadOpen = true">
          Hujjat Yuklash
        </el-button>

        <ProjectDocumentsUpload
          v-if="!readonly"
          v-model:open="isUploadOpen"
          :project-id="projectId"
          @uploaded="onUploaded"
        />
      </div>

      <!-- filter -->
      <div class="mt-4">
        <el-input
          v-model="search"
          clearable
          placeholder="Qidirish... (nom bo‘yicha)"
          @clear="search = ''"
          class="max-w-md"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
    </div>

    <!-- list (faqat shu scroll) -->
    <div class="flex-1 min-h-0 overflow-y-auto p-6 pt-4">
      <ProjectDocumentsList
        :items="filteredItems"
        :loading="loading"
        :readonly="readonly"
        :downloading-id="downloadingId"
        @delete="confirmDelete"
        @download="downloadDoc"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import api from "@/utils/axios";

import ProjectDocumentsUpload from "./ProjectDocumentsUpload.vue";
import ProjectDocumentsList from "./ProjectDocumentsList.vue";

type ProjectDoc = {
  id: number;
  file?: string;
  name?: string;
  createdAt?: string;
};

const props = defineProps<{ readonly?: boolean }>();
const route = useRoute();
const projectId = computed(() => Number(route.params.id));

const loading = ref(false);
const isUploadOpen = ref(false);
const items = ref<ProjectDoc[]>([]);
const search = ref("");
const downloadingId = ref<number | null>(null);

// const API = {
//   list: (projectId: number) => `/project/document/${projectId}`,
//   del: (id: number) => `/project/document/${id}`,
// };

const fetchDocs = async () => {
  loading.value = true;
  try {
    const res = await api.get(`/document/${projectId.value}`);
    items.value = res.data?.data ?? [];
  } catch (e) {
    ElMessage.error("Documentlarni yuklashda xatolik");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDocs);

const filteredItems = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return items.value;

  return items.value.filter((d: any) =>
    String(d.name || d.file || d.id || "")
      .toLowerCase()
      .includes(q),
  );
});

const onUploaded = async () => {
  isUploadOpen.value = false;
  await fetchDocs();
};

const confirmDelete = async (row: ProjectDoc) => {
  try {
    await ElMessageBox.confirm("Hujjatni o‘chirmoqchimisiz?", "Ogohlantirish", {
      type: "warning",
      confirmButtonText: "Ha",
      cancelButtonText: "Yo‘q",
    });

    await api.delete(`/document/${row.id}`);
    ElMessage.success("O‘chirildi");
    fetchDocs();
  } catch (_) {}
};

const getFileUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) {
    return path;
  }
  return `https://reestr.das-uty.uz/api/${path}`;
};

const fileName = (path?: string) => {
  if (!path) return "";
  try {
    const parts = path.split("/");
    return parts[parts.length - 1];
  } catch {
    return path;
  }
};

const downloadDoc = async (row: ProjectDoc) => {
  const url = row.file ? getFileUrl(row.file) : "";
  if (!url) return;

  downloadingId.value = row.id;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok.");
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = row.name || fileName(row.file) || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    ElMessage.error("Hujjatni yuklashda xatolik");
  } finally {
    downloadingId.value = null;
  }
};
</script>