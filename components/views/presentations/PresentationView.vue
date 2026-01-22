<template>
  <div
     class="flex flex-col gap-6 p-6  !pb-12 bg-gray-50 dark:bg-gray-900 overflow-x-hidden"
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
      :total-count="presentations.length"
    />

    <!-- LIST -->
    <PresentationsList
      :presentations="presentations"
      :loading="loading"
      @edit="openEditDialog"
      @view="viewPresentation"
      @delete="confirmDelete"
      @order-change="handleOrderChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
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

    // ORDER bo‘yicha sort
    presentations.value.sort((a, b) => a.order - b.order);
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

/* ACTIONS */
const openFormDialog = () => {
  isEditMode.value = false;
  isViewMode.value = false;
  editData.value = null;
  formDialog.value = true;
};

const openEditDialog = (row: Presentation) => {
  router.push(`/presentations/edit/${row.id}`);
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
    fetchPresentations();
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
    fetchPresentations();
  } finally {
    loader.close();
  }
};
</script>
