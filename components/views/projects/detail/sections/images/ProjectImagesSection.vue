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
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Images</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Project rasmlari ro‘yxati, qidiruv, upload va amallar
          </p>
        </div>

        <el-button
          v-if="!readonly"
          type="primary"
          :icon="Plus"
          class="!rounded-xl"
          @click="openUpload"
        >
          Rasm qo‘shish
        </el-button>
      </div>

      <!-- filter -->
      <div class="mt-4 flex items-center gap-3">
        <el-input
          v-model="search"
          clearable
          placeholder="Qidirish... (id yoki path)"
          class="max-w-md"
          @clear="onClear"
          @keyup.enter="onSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <el-button class="!rounded-xl" @click="onSearch" :loading="loading">
          Qidirish
        </el-button>

        <el-button v-if="search" class="!rounded-xl" @click="onClear">
          Tozalash
        </el-button>
      </div>
    </div>

    <!-- list (faqat shu scroll) -->
    <div class="flex-1 min-h-0 overflow-y-auto p-6 pt-4">
      <ProjectImagesList
        :items="filteredItems"
        :loading="loading"
        :readonly="readonly"
        :total="filteredItems.length"
        :currentPage="1"
        :pageSize="filteredItems.length"
        @delete="confirmDelete"
      />
    </div>

    <!-- upload dialog -->
    <ProjectImagesUpload
      v-model:open="uploadOpen"
      :project-id="projectId"
      @uploaded="onUploaded"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, Search } from "@element-plus/icons-vue";
import api from "@/utils/axios";

import ProjectImagesList from "./ProjectImagesList.vue";
import ProjectImagesUpload from "./ProjectImagesUpload.vue";

type ProjectImage = {
  id: number;
  image: string;
  createdAt?: string;
};

const props = defineProps<{
  projectId: number;
  readonly?: boolean;
}>();

const loading = ref(false);
const items = ref<ProjectImage[]>([]);
const search = ref("");
const uploadOpen = ref(false);

const fetchImages = async () => {
  if (!props.projectId) return;

  loading.value = true;
  try {
    const res = await api.get(`/project/image/${props.projectId}`);
    items.value = (res.data?.data ?? res.data ?? []) as ProjectImage[];

    // newest first (createdAt bo'lsa)
    items.value = [...items.value].sort((a: any, b: any) => {
      const ta = new Date(a.createdAt || 0).getTime();
      const tb = new Date(b.createdAt || 0).getTime();
      return tb - ta;
    });
  } catch (e) {
    ElMessage.error("Rasmlarni yuklashda xatolik");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchImages);

// projectId o'zgarsa (route param o'zgarganda ham) qayta yuklab oladi
watch(
  () => props.projectId,
  () => fetchImages(),
);

const filteredItems = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return items.value;

  return items.value.filter((x) => {
    const idOk = String(x.id).includes(q);
    const pathOk = String(x.image || "").toLowerCase().includes(q);
    return idOk || pathOk;
  });
});

const onSearch = () => {
  // local filter (computed)
};
const onClear = () => {
  search.value = "";
};

const openUpload = () => {
  uploadOpen.value = true;
};

const onUploaded = async () => {
  uploadOpen.value = false;
  await fetchImages();
};

const confirmDelete = (row: ProjectImage) => {
  ElMessageBox.confirm("Rasmni o‘chirmoqchimisiz?", "Ogohlantirish", {
    type: "warning",
    confirmButtonText: "Ha",
    cancelButtonText: "Yo‘q",
  }).then(async () => {
    try {
      await api.delete(`/project/image/${row.id}`);
      ElMessage.success("O‘chirildi");
      fetchImages();
    } catch (e) {
      ElMessage.error("O‘chirishda xatolik");
    }
  });
};
</script>
