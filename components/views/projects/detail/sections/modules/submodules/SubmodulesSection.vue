<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 flex flex-col gap-4">
    <!-- Header -->
    <div class="flex items-start justify-between gap-3">
      <div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Submodullar</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Modul ichidagi submodullar ro‘yxati
        </p>
      </div>

      <el-button type="primary" class="!rounded-xl" @click="openCreate">
        + Submodule qo‘shish
      </el-button>
    </div>

    <!-- Filter -->
    <SubmodulesFilter v-model:search="params.search" @search="onSearch" />

    <!-- List -->
    <div class="flex-1 min-h-0">
      <SubmodulesList
        :items="paginated"
        :loading="loading"
        :total="filtered.length"
        :currentPage="params.page"
        :pageSize="params.size"
        @page-change="onPageChange"
        @size-change="onSizeChange"
        @edit="openEdit"
        @delete="confirmDelete"
      />
    </div>

    <!-- Form modal -->
    <SubmoduleForm
      v-model:open="formOpen"
      :moduleId="moduleId"
      :editData="editData"
      @saved="fetchSubmodules"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import api from "@/utils/axios";

import SubmodulesFilter from "./SubmodulesFilter.vue";
import SubmodulesList from "./SubmodulesList.vue";
import SubmoduleForm from "./SubmoduleForm.vue";

type Submodule = any;

const props = defineProps<{ moduleId: number }>();

const loading = ref(false);
const list = ref<Submodule[]>([]);

const formOpen = ref(false);
const editData = ref<Submodule | null>(null);

const params = ref({
  page: 1,
  size: 10,
  search: "",
});

const fetchSubmodules = async () => {
  loading.value = true;
  try {
    const res = await api.get(`/submodule/${props.moduleId}`);
    // swagger: array qaytadi
    list.value = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
  } catch (e) {
    ElMessage.error("Submodullarni yuklashda xatolik");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchSubmodules);

/** frontend search */
const filtered = computed(() => {
  const q = params.value.search.trim().toLowerCase();
  if (!q) return list.value;

  return list.value.filter((s: any) => {
    const hay = [
      s.nameUz, s.nameEn, s.nameRu, s.nameKiril,
      s.status,
      s.startDate, s.endDate,
    ].filter(Boolean).join(" ").toLowerCase();
    return hay.includes(q);
  });
});

/** frontend pagination */
const paginated = computed(() => {
  const start = (params.value.page - 1) * params.value.size;
  return filtered.value.slice(start, start + params.value.size);
});

const onSearch = () => (params.value.page = 1);
const onPageChange = (p: number) => (params.value.page = p);
const onSizeChange = (s: number) => {
  params.value.size = s;
  params.value.page = 1;
};

const openCreate = () => {
  editData.value = null;
  formOpen.value = true;
};

const openEdit = (row: any) => {
  editData.value = row;
  formOpen.value = true;
};

const confirmDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      "Submodule o‘chirilsinmi?",
      "Ogohlantirish",
      { type: "warning", confirmButtonText: "Ha", cancelButtonText: "Bekor" }
    );
    await api.delete(`/submodule/${row.id}`);
    ElMessage.success("O‘chirildi");
    await fetchSubmodules();
  } catch (_) {}
};
</script>
