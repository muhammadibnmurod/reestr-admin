<template>
  <div class="flex flex-col gap-6 h-full p-6 bg-gray-50 dark:bg-gray-900">
    <!-- Header + Create button -->
    <div class="flex justify-between items-center pb-4">
      <h1 class="text-black dark:text-white text-3xl font-inter font-bold">
        Loyihalar
      </h1>

      <el-button type="primary" class="flex items-center text-center !p-6" :icon="ElIconPlus" @click="createProject">
        <p class="w-full flex items-center text-center">Yangi loyiha</p>
      </el-button>
    </div>

    <!-- Filter search -->
    <ProjectsFilter v-model:search="params.search" @search="handleSearch" />

    <!-- Projects table -->
    <ProjectsList
      :projects="projects"
      :loading="loading"
      :total="totalRecords"
      :currentPage="params.page"
      :pageSize="params.size"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
      @delete="deleteProject"
      @edit="editProject"
      @view="viewProject"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import api from "@/utils/axios";
import { useRouter } from "vue-router";
import { Plus as ElIconPlus } from "@element-plus/icons-vue";

import ProjectsFilter from "@/components/views/projects/ProjectsFilter.vue";
import ProjectsList from "@/components/views/projects/ProjectsList.vue";

const router = useRouter();

const projects = ref<any[]>([]);
const loading = ref(false);
const totalRecords = ref(0);

const params = ref({ page: 1, size: 10, status: "pending", search: "" });

const fetchProjects = async () => {
  loading.value = true;
  try {
    const res = await api.get("/project", { params: params.value });
    projects.value = res.data.data.data;
    totalRecords.value = res.data.data.totalPage * params.value.size;
  } catch (e) {
    ElMessage.error("Loyihalarni yuklashda xatolik");
  } finally {
    loading.value = false;
  }
};

const deleteProject = async (project: any) => {
  loading.value = true;
  try {
    await api.delete(`/project/${project.id}`);
    ElMessage.success("Loyiha muvaffaqiyatli o'chirildi");
    fetchProjects();
  } catch (e) {
    ElMessage.error("Loyihani o'chirishda xatolik");
  } finally {
    loading.value = false;
  }
};

const viewProject = (project: any) => {
  router.push(`/projects/${project.id}?mode=view`);
};

const editProject = (project: any) => {
  router.push(`/projects/${project.id}?mode=edit`);
};

const createProject = () => {
  router.push("/projects/create");
};

const handlePageChange = (page: number) => {
  params.value.page = page;
  fetchProjects();
};

const handleSizeChange = (size: number) => {
  params.value.size = size;
  params.value.page = 1;
  fetchProjects();
};

const handleSearch = () => {
  params.value.page = 1;
  fetchProjects();
};

onMounted(() => {
  fetchProjects();
});
</script>
