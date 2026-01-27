<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col min-h-0"
  >
    <!-- header (qotadi) -->
    <div class="p-6 border-b border-gray-200/60 dark:border-gray-700/60 flex-shrink-0">
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

    <!-- list (faqat shu scroll) -->
    <div class="flex-1 min-h-0 overflow-y-auto p-6 pt-4">
      <ModulesList
        :modules="filteredModules"
        :loading="loading"
        :readonly="readonly"
        :project-id="projectId"
        @edit="openEdit"
        @delete="confirmDelete"
        @view-submodules="openSubmodules"
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
import { useRoute, useRouter } from "vue-router";

import ModulesFilter from "@/components/views/projects/detail/sections/modules/ModulesFilter.vue";
import ModulesList from "@/components/views/projects/detail/sections/modules/ModulesList.vue";
import ModuleForm from "@/components/views/projects/detail/sections/modules/ModuleForm.vue";

type ModuleItem = any;

const props = defineProps<{
  readonly?: boolean;
}>();

const route = useRoute();
const router = useRouter();
const projectId = computed(() => Number(route.params.id));

const loading = ref(false);
const modules = ref<ModuleItem[]>([]);
const search = ref("");

const formOpen = ref(false);
const editData = ref<ModuleItem | null>(null);

const fetchModules = async () => {
  loading.value = true;
  try {
    const res = await api.get(`/module/project/${projectId.value}`);
    modules.value = res.data?.data ?? res.data ?? [];
    modules.value = [...modules.value].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
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
    const name = [m.nameUz, m.nameEn, m.nameRu, m.nameKiril].filter(Boolean).join(" ");
    const desc = [m.descriptionUz, m.descriptionEn, m.descriptionRu, m.descriptionKiril].filter(Boolean).join(" ");
    return (name + " " + desc).toLowerCase().includes(q);
  });
});

const onSearch = () => {};
const onClear = () => (search.value = "");

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
  ElMessageBox.confirm("Haqiqatdan ham modulni o‘chirmoqchimisiz?", "Ogohlantirish", {
    type: "warning",
    confirmButtonText: "Ha",
    cancelButtonText: "Yo‘q",
  }).then(async () => {
    try {
      await api.delete(`/module/${row.id}`);
      ElMessage.success("O‘chirildi");
      fetchModules();
    } catch (e) {
      ElMessage.error("O‘chirishda xatolik");
    }
  });
};

const openSubmodules = (row: any) => {
  router.push(`/projects/${projectId.value}/modules/${row.id}`);
};
</script>
