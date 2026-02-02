<template>
  <div class="h-full overflow-hidden bg-gray-50 dark:bg-gray-900 flex flex-col">
    <DocumentCategoryForm
        v-model:open="formOpen"
        :isEditMode="isEditMode"
        :isViewMode="isViewMode"
        :editData="editData"
        @saved="fetchItems"
    />

    <!-- Sticky header + filter -->
    <div class="sticky top-0 z-20 border-b border-gray-200/60 dark:border-gray-700/60 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur">
      <div class="p-6 flex flex-col gap-4">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h1 class="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Document Categories
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Hujjat kategoriyalarini boshqarish
            </p>
          </div>

          <el-button type="primary" class="!rounded-xl" :icon="Plus" @click="openCreate">
            Qo‘shish
          </el-button>
        </div>

        <DocumentCategoriesFilter
            v-model:search="filter.search"
            :total="filtered.length"
            :loading="loading"
            @search="onSearch"
            @clear="onClear"
        />
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 min-h-0 p-6 pt-4 overflow-hidden">
      <div class="h-full bg-white dark:bg-[#1e222b] rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
        <DocumentCategoriesList
            :items="paginated"
            :loading="loading"
            :total="filtered.length"
            :currentPage="filter.currentPage"
            :pageSize="filter.pageSize"
            @view="openView"
            @edit="openEdit"
            @delete="confirmDelete"
            @page-change="onPageChange"
            @size-change="onSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import api from "@/utils/axios";

import DocumentCategoriesFilter from "./DocumentCategoriesFilter.vue";
import DocumentCategoriesList from "./DocumentCategoriesList.vue";
import DocumentCategoryForm from "./DocumentCategoryForm.vue";

type Category = {
  id: number;
  nameUz?: string;
  nameRu?: string;
  nameEn?: string;
  nameKiril?: string;
};

const loading = ref(false);
const items = ref<Category[]>([]);

const filter = ref({
  currentPage: 1,
  pageSize: 10,
  search: "",
});

const formOpen = ref(false);
const isEditMode = ref(false);
const isViewMode = ref(false);
const editData = ref<Category | null>(null);

const fetchItems = async () => {
  loading.value = true;
  try {
    const res = await api.get("/document-category");
    items.value = res.data?.data ?? res.data ?? [];
  } catch (e) {
    ElMessage.error("Kategoriya ro‘yxatini yuklashda xatolik");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchItems);

const filtered = computed(() => {
  const q = filter.value.search.trim().toLowerCase();
  if (!q) return items.value;

  return items.value.filter((c) => {
    const s = [
      c.nameUz,
      c.nameRu,
      c.nameEn,
      c.nameKiril,
      c.id,
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
    return s.includes(q);
  });
});

const paginated = computed(() => {
  const start = (filter.value.currentPage - 1) * filter.value.pageSize;
  return filtered.value.slice(start, start + filter.value.pageSize);
});

/* filter actions */
const onSearch = () => {
  filter.value.currentPage = 1;
};
const onClear = () => {
  filter.value.search = "";
  filter.value.currentPage = 1;
};
const onPageChange = (p: number) => (filter.value.currentPage = p);
const onSizeChange = (s: number) => {
  filter.value.pageSize = s;
  filter.value.currentPage = 1;
};

/* form actions */
const openCreate = () => {
  isEditMode.value = false;
  isViewMode.value = false;
  editData.value = null;
  formOpen.value = true;
};

const openEdit = (row: Category) => {
  isEditMode.value = true;
  isViewMode.value = false;
  editData.value = { ...row };
  formOpen.value = true;
};

const openView = (row: Category) => {
  isEditMode.value = false;
  isViewMode.value = true;
  editData.value = { ...row };
  formOpen.value = true;
};

const confirmDelete = async (row: Category) => {
  try {
    await ElMessageBox.confirm(
        `“${row.nameUz || row.nameEn || row.nameRu || row.nameKiril || row.id}” kategoriyasini o‘chirmoqchimisiz?`,
        "Ogohlantirish",
        {
          type: "warning",
          confirmButtonText: "Ha",
          cancelButtonText: "Yo‘q",
          appendTo: document.body,
        },
    );

    await api.delete(`/document-category/${row.id}`);
    ElMessage.success("O‘chirildi");
    fetchItems();
  } catch (_) {}
};
</script>
