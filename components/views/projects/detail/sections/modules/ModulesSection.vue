<template>
  <div
    class="bg-white h-screen overflow-hidden dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700"
  >
    <!-- header -->
    <div class="p-6 border-b border-gray-200/60 dark:border-gray-700/60">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">
            Modules
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Project modullar ro‘yxati, qidiruv va amallar
          </p>
        </div>

        <el-button
          v-if="!readonly"
          type="primary"
          :icon="Plus"
          class="!rounded-xl"
          @click="openCreate"
        >
          Modul qo‘shish
        </el-button>
      </div>

      <div class="mt-4">
        <ModulesFilter
          v-model:search="search"
          :loading="loading"
          @search="onSearch"
          @clear="onClear"
        />
      </div>
    </div>

    <!-- list -->
    <div class="p-6 pt-4">
      <ModulesList
        :modules="filteredModules"
        :loading="loading"
        :readonly="readonly"
        @edit="openEdit"
        @delete="confirmDelete"
        @view-submodules="goSubmodules"
      />
    </div>

    <!-- form dialog -->
    <ModuleForm
      v-model:open="formOpen"
      :project-id="projectId"
      :edit-data="editData"
      @saved="onSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import api from "@/utils/axios";

import ModulesFilter from "./ModulesFilter.vue";
import ModulesList from "./ModulesList.vue";
import ModuleForm from "./ModuleForm.vue";

type ModuleItem = any;

const props = defineProps<{
  projectId: number;
  readonly?: boolean;
}>();

const loading = ref(false);
const modules = ref<ModuleItem[]>([]);
const search = ref("");

const formOpen = ref(false);
const editData = ref<ModuleItem | null>(null);

const fetchModules = async () => {
  loading.value = true;
  try {
    const res = await api.get(`/module/project/${props.projectId}`);
    // ba'zi backendlar: res.data.data yoki res.data
    modules.value = res.data?.data ?? res.data ?? [];
    // agar order bo'lsa, tartiblash
    modules.value = [...modules.value].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0),
    );
  } catch (e) {
    ElMessage.error("Modullarni yuklashda xatolik");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchModules);

const filteredModules = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return modules.value;

  return modules.value.filter((m: any) => {
    const name =
      (m.nameUz || "") +
      " " +
      (m.nameEn || "") +
      " " +
      (m.nameRu || "") +
      " " +
      (m.nameKiril || "");
    const desc =
      (m.descriptionUz || "") +
      " " +
      (m.descriptionEn || "") +
      " " +
      (m.descriptionRu || "") +
      " " +
      (m.descriptionKiril || "");

    return (name + " " + desc).toLowerCase().includes(q);
  });
});

const onSearch = () => {
  // local filter (computed). Agar backend search bo'lsa, shu joyda fetch qilasan.
};

const onClear = () => {
  search.value = "";
};

const openCreate = () => {
  editData.value = null;
  formOpen.value = true;
};

const openEdit = (row: ModuleItem) => {
  editData.value = { ...row };
  formOpen.value = true;
};

const onSaved = async () => {
  formOpen.value = false;
  editData.value = null;
  await fetchModules();
};

const confirmDelete = (row: ModuleItem) => {
  ElMessageBox.confirm(
    "Haqiqatdan ham modulni o‘chirmoqchimisiz?",
    "Ogohlantirish",
    {
      type: "warning",
      confirmButtonText: "Ha",
      cancelButtonText: "Yo‘q",
    },
  ).then(async () => {
    try {
      await api.delete(`/module/${row.id}`);
      ElMessage.success("O‘chirildi");
      fetchModules();
    } catch (e) {
      ElMessage.error("O‘chirishda xatolik");
    }
  });
};

const goSubmodules = (row: ModuleItem) => {
  // keyin submodules section ulaymiz, hozircha message
  ElMessage.info(`Submodules: moduleId=${row.id}`);
};
</script>
