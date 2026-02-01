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
            Assignments
          </h1>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Project PM va xodimlarni biriktirish
          </p>
        </div>

        <div class="flex items-center gap-2">
          <el-button
            type="primary"
            class="!rounded-xl"
            :icon="UserFilled"
            @click="pmDialog = true"
          >
            PM biriktirish
          </el-button>

          <el-button class="!rounded-xl" :icon="Plus" @click="empDialog = true">
            Xodim qo‘shish
          </el-button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 min-h-0 p-6  overflow-y-auto">
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <!-- PM -->
        <div
          class="bg-white dark:bg-[#1e222b] rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col"
        >
          <div class="p-6 border-b border-gray-200/60 dark:border-gray-700/60">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">
                  Project Manager
                </h2>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Loyiha PM
                </p>
              </div>

              <el-button
                type="primary"
                plain
                class="!rounded-xl"
                :icon="UserFilled"
                @click="pmDialog = true"
              >
                Tanlash
              </el-button>
            </div>
          </div>

          <div class="flex-1 min-h-0 p-6 pt-4">
            <AssignmentsPMList
              :pm="project?.pm || null"
              :readonly="readonly"
              @unassign-pm="unassignPm"
            />
          </div>
        </div>

        <!-- Employees -->
        <div
          class="bg-white dark:bg-[#1e222b] rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col"
        >
          <div class="p-6 border-b border-gray-200/60 dark:border-gray-700/60">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">
                  Employees
                </h2>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Loyiha xodimlari
                </p>
              </div>

              <el-button
                v-if="!readonly"
                type="primary"
                class="!rounded-xl"
                :icon="Plus"
                @click="empDialog = true"
              >
                Qo‘shish
              </el-button>
            </div>
          </div>

          <div class="flex-1 min-h-0 p-6 pt-4">
            <AssignmentsEmployeeList
              :employees="employees"
              :readonly="readonly"
              @unassign-employee="unassignEmployee"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- dialogs -->
    <AssignmentsPMForm
      v-model:open="pmDialog"
      :project-id="projectId"
      :all-employees="employees"
      @assigned="refresh"
    />

<AssignmentsEmployeeForm
  v-model:open="empDialog"
  :project-id="projectId"
  :project-employees="projectEmployees"
  @assigned="refresh"
  @picked="(emp) => console.log('tanlandi:', emp)"
/>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, UserFilled } from "@element-plus/icons-vue";
import api from "@/utils/axios";

const route = useRoute();
const projectId = computed(() => Number(route.params.id));
const readonly = computed(() => route.query.mode === "view");

const loading = ref(false);
const project = ref<any>(null);
const employees = ref<any[]>([]);

const pmDialog = ref(false);
const empDialog = ref(false);

const projectEmployees = ref<any[]>([]);

const fetchProjectEmployees = async () => {
  const res = await api.get(`/employee/${projectId.value}`);
  projectEmployees.value = res.data?.data ?? [];
};


const fetchProject = async () => {
  loading.value = true;
  try {
    const res = await api.get(`/project/${projectId.value}`);
    project.value = res.data?.data ?? res.data;
  } catch {
    ElMessage.error("Project yuklashda xatolik");
  } finally {
    loading.value = false;
  }
};

const fetchEmployees = async () => {
  try {
    const res = await api.get(`/employee/${projectId.value}`);
    employees.value = res.data?.data ?? [];
  } catch (e) {
    employees.value = [];
  }
};

const refresh = async () => {
  await fetchProject();
  await fetchEmployees();
};

onMounted(async () => {
  await fetchProject();
  await fetchEmployees();
});

const unassignPm = async () => {
  try {
    await ElMessageBox.confirm("PMni olib tashlaysizmi?", "Ogohlantirish", {
      type: "warning",
      confirmButtonText: "Ha",
      cancelButtonText: "Yo‘q",
    });

    await api.put(`/project/${projectId.value}`, { pmId: 0 });
    ElMessage.success("PM olib tashlandi");
    refresh();
  } catch {}
};

const unassignEmployee = async (employeeId: number) => {
  try {
    await ElMessageBox.confirm(
      "Xodimni loyihadan olib tashlaysizmi?",
      "Ogohlantirish",
      {
        type: "warning",
        confirmButtonText: "Ha",
        cancelButtonText: "Yo‘q",
      },
    );

await api.delete("/assignment/project", {
  data: { projectId: projectId.value, employeeId },
});

    ElMessage.success("Xodim olib tashlandi");
    refresh();
  } catch {}
};
</script>
