<template>
  <div
    class="h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 flex flex-col"
  >
    <!-- Sticky header -->
    <div
      class="sticky top-0 z-20 border-b border-gray-200/60 dark:border-gray-700/60 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur"
    >
      <div class="p-6 flex items-start justify-between gap-4">
        <div>
          <h1
            class="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight"
          >
            {{ project?.nameUz || "Project" }}
          </h1>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Status: {{ project?.status || "-" }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <el-button @click="refresh" :loading="loading" class="!rounded-xl">
            Yangilash
          </el-button>
          <el-button type="primary" class="!rounded-xl" @click="goEdit">
            Tahrirlash
          </el-button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="px-6 pb-4">
        <el-tabs v-model="activeTab" class="project-tabs">
          <el-tab-pane label="Overview" name="overview" />
          <el-tab-pane label="Modules" name="modules" />
          <el-tab-pane label="Images" name="images" />
          <el-tab-pane label="Documents" name="documents" />
          <el-tab-pane label="Assignments" name="assignments" />
        </el-tabs>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 min-h-0 p-6 pt-4 overflow-y-auto">
      <div v-loading="loading">
        <!-- OVERVIEW -->
        <ProjectOverview
          v-if="activeTab === 'overview'"
          :project="project"
          :pm="project?.pm"
        />

        <!-- MODULES -->
        <ModulesSection
          v-else-if="activeTab === 'modules'"
          :project-id="projectId"
        />

        <!-- IMAGES -->
        <div
          v-else-if="activeTab === 'images'"
          class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700"
        >
          <div class="text-gray-700 dark:text-gray-200 font-semibold">
            Images bo‘limi
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Keyingi bosqichda shu section componentini ulaymiz.
          </div>
        </div>

        <!-- DOCUMENTS -->
        <div
          v-else-if="activeTab === 'documents'"
          class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700"
        >
          <div class="text-gray-700 dark:text-gray-200 font-semibold">
            Documents bo‘limi
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Keyingi bosqichda shu section componentini ulaymiz.
          </div>
        </div>

        <!-- ASSIGNMENTS -->
        <div
          v-else
          class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700"
        >
          <div class="text-gray-700 dark:text-gray-200 font-semibold">
            Assignments bo‘limi
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Keyingi bosqichda shu section componentini ulaymiz.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import api from "@/utils/axios";

type Project = any;

const props = defineProps<{
  projectId: number;
}>();

const router = useRouter();
const loading = ref(false);
const project = ref<Project | null>(null);
const activeTab = ref<
  "overview" | "modules" | "images" | "documents" | "assignments"
>("overview");

const fetchProject = async () => {
  loading.value = true;
  try {
    const res = await api.get(`/project/${props.projectId}`);
    // backend ko‘rinishiga mos: ba’zida res.data.data bo‘ladi
    project.value = res.data?.data ?? res.data;
  } catch (e) {
    ElMessage.error("Projectni yuklashda xatolik");
  } finally {
    loading.value = false;
  }
};

const refresh = () => fetchProject();

const goEdit = () => {
  router.push(`/projects/${props.projectId}?mode=edit`);
};

onMounted(fetchProject);
</script>

<style scoped>
:deep(.project-tabs .el-tabs__header) {
  @apply m-0;
}
</style>
