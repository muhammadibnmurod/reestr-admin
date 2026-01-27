<template>
  <div
    class="h-[calc(100vh-164px)] overflow-hidden flex flex-col gap-6 p-6 !pb-12 bg-gray-50 dark:bg-gray-900 overflow-x-hidden"
  >
    <!-- FORM DIALOG -->
    <PresentationForm
      v-model:open="formDialog"
      :isEditMode="isEditMode"
      :isViewMode="isViewMode"
      :editData="editData"
      @save="fetchPresentations"
    />

    <!-- HEADER -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-black dark:text-white">
          Taqdimotlar
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Mahsulot taqdimotlarini boshqarish
        </p>
      </div>

      <el-button type="primary" @click="openFormDialog">
        + Taqdimot qo‘shish
      </el-button>
    </div>

    <!-- FILTER -->
    <PresentationsFilter
      v-model:search="filterParams.search"
      :total-count="filteredPresentations.length"
      @search="onSearch"
    />

    <!-- LIST + PAGINATION WRAP -->
    <div class="flex-1 min-h-0 flex flex-col gap-4">
      <!-- TABLE -->
      <div class="flex-1 min-h-0">
        <PresentationsList
          :presentations="paginatedPresentations"
          :loading="loading"
          @edit="openEditDialog"
          @view="viewPresentation"
          @delete="confirmDelete"
          @order-change="handleOrderChange"
          class="h-full"
        />
      </div>

      <!-- PAGINATION -->
      <div
        class="bg-white dark:bg-[#1e222b] rounded-2xl border border-gray-100 dark:border-gray-700 px-4 py-3 flex items-center justify-end"
      >
        <el-pagination
          v-model:current-page="filterParams.currentPage"
          v-model:page-size="filterParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredPresentations.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="onSizeChange"
          @current-change="onPageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { ElMessageBox, ElNotification, ElLoading } from "element-plus";
import api from "@/utils/axios";
import type { Presentation } from "@/types";

import PresentationForm from "./PresentationForm.vue";
import PresentationsFilter from "./PresentationsFilter.vue";
import PresentationsList from "./PresentationsList.vue";

const router = useRouter();

const presentations = ref<Presentation[]>([]);
const loading = ref(false);

const formDialog = ref(false);
const isEditMode = ref(false);
const isViewMode = ref(false);
const editData = ref<Presentation | null>(null);

const filterParams = ref({
  currentPage: 1,
  pageSize: 10,
  search: "",
});

const fetchPresentations = async () => {
  loading.value = true;
  try {
    const res = await api.get("/presentation");
    presentations.value = res.data.data || [];
    presentations.value.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (err: any) {
    ElNotification({
      title: "Xatolik",
      message:
        err.response?.data?.message ||
        "Taqdimotlarni yuklashda xatolik yuz berdi",
      type: "error",
      position: "top-right",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(fetchPresentations);

/** ✅ SEARCH FILTER (frontend) */
const filteredPresentations = computed(() => {
  const q = filterParams.value.search.trim().toLowerCase();
  if (!q) return presentations.value;

  return presentations.value.filter((p) => {
    const hay = [
      p.titleUz,
      p.titleEn,
      p.titleRu,
      p.titleKiril,
      p.subtitleUz,
      p.subtitleEn,
      p.subtitleRu,
      p.subtitleKiril,
      p.descriptionUz,
      p.descriptionEn,
      p.descriptionRu,
      p.descriptionKiril,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return hay.includes(q);
  });
});

/** ✅ PAGINATION (frontend) */
const paginatedPresentations = computed(() => {
  const page = filterParams.value.currentPage;
  const size = filterParams.value.pageSize;
  const start = (page - 1) * size;
  return filteredPresentations.value.slice(start, start + size);
});

const onSearch = () => {
  // search o'zgarsa 1-page ga qaytamiz
  filterParams.value.currentPage = 1;
};

const onPageChange = (page: number) => {
  filterParams.value.currentPage = page;
};

const onSizeChange = (size: number) => {
  filterParams.value.pageSize = size;
  filterParams.value.currentPage = 1;
};

/* ACTIONS */
const openFormDialog = () => {
  isEditMode.value = false;
  isViewMode.value = false;
  editData.value = null;
  formDialog.value = true;
};

const openEditDialog = (row: Presentation) => {
  router.push(`/components/views/presentations/pages/${row.id}`);
};

const viewPresentation = (row: Presentation) => {
  router.push(`/components/views/presentations/pages/${row.id}`);
};

const confirmDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm(
      "Ushbu taqdimotni o‘chirmoqchimisiz?",
      "Ogohlantirish",
      {
        confirmButtonText: "Ha, o‘chirish",
        cancelButtonText: "Bekor qilish",
        type: "warning",
      }
    );
    await onDelete(id);
  } catch (_) {}
};

const onDelete = async (id: number) => {
  const loader = ElLoading.service({
    fullscreen: true,
    text: "O‘chirilmoqda...",
  });

  try {
    await api.delete(`/presentation/${id}`);
    ElNotification({
      title: "Muvaffaqiyatli",
      message: "Taqdimot o‘chirildi",
      type: "success",
    });
    await fetchPresentations();

    // agar oxirgi page bo'shab qolsa, oldingi page ga qaytaramiz
    const total = filteredPresentations.value.length;
    const maxPage = Math.max(1, Math.ceil(total / filterParams.value.pageSize));
    if (filterParams.value.currentPage > maxPage) {
      filterParams.value.currentPage = maxPage;
    }
  } finally {
    loader.close();
  }
};

const handleOrderChange = async (
  payload: Array<{ id: number; order: number }>
) => {
  const loader = ElLoading.service({
    fullscreen: true,
    text: "Tartib o‘zgartirilmoqda...",
  });

  try {
    await api.put("/presentation/change-order", payload);
    ElNotification({
      title: "Muvaffaqiyatli",
      message: "Tartib saqlandi",
      type: "success",
    });
    await fetchPresentations();
  } finally {
    loader.close();
  }
};
</script>
