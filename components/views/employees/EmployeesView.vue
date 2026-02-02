<template>
  <div
    class="h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 flex flex-col"
  >
    <EmployeesForm
      v-model:open="formDialog"
      :isEditMode="isEditMode"
      :isViewMode="isViewMode"
      :editData="editData"
      @save="fetchEmployees"
    />

    <!-- Sticky header + filter -->
    <div
      class="sticky top-0 z-20 border-b border-gray-200/60 dark:border-gray-700/60 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur"
    >
      <div class="p-6 flex flex-col gap-4">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h1
              class="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight"
            >
              {{ $t("employee.title") }}
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Xodimlar ro‘yxati, qidiruv va amallar.
            </p>
          </div>

          <el-button
            :icon="ElIconPlus"
            type="primary"
            @click="openFormDialog()"
            class="!px-5 !py-2 !rounded-xl shadow-md"
          >
            {{ $t("common.add") }}
          </el-button>
        </div>

        <EmployeesFilter
          v-model:search="filterParams.search"
          @search="handleSearch"
        />
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 min-h-0 p-6 pt-4 overflow-hidden">
      <div
        class="h-full bg-white dark:bg-[#1e222b] rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        <EmployeesList
          :employees="employees"
          :loading="loading"
          :total="totalRecords"
          :currentPage="filterParams.currentPage"
          :pageSize="filterParams.pageSize" 
          @edit="openEditDialog"
          @view="viewEmployee"
          @delete="confirmDelete"
          @page-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { Plus as ElIconPlus } from "@element-plus/icons-vue";
import api from "@/utils/axios";
import EmployeesForm from "./EmployeesForm.vue";
import EmployeesFilter from "./EmployeesFilter.vue";
import EmployeesList from "./EmployeesList.vue";

const employees = ref<any[]>([]);
const loading = ref(false);

const formDialog = ref(false);
const isEditMode = ref(false);
const isViewMode = ref(false);
const editData = ref<any>(null);

const totalRecords = ref(0);
const totalPages = ref(0);

const filterParams = ref({
  currentPage: 1,
  pageSize: 10,
  search: "",
});

const fetchEmployees = async () => {
  loading.value = true;
  try {
    const response = await api.get("/employee", {
      params: {
        page: filterParams.value.currentPage,
        size: filterParams.value.pageSize,
        "full-name": filterParams.value.search || undefined,
      },
    });

    employees.value = response.data.data.data || [];
    totalPages.value = response.data.data.totalPage || 0;

    // Agar backend total record qaytarsa shuni ishlating:
    // totalRecords.value = response.data.data.total || 0;
    // Hozircha sizdagi hisob:
    totalRecords.value = totalPages.value * filterParams.value.pageSize;
  } catch (error) {
    console.error("Error fetching employees:", error);
    ElMessage.error("Xodimlarni yuklashda xatolik yuz berdi");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchEmployees);

const openFormDialog = () => {
  isEditMode.value = false;
  isViewMode.value = false;
  editData.value = null;
  formDialog.value = true;
};

const openEditDialog = (employee: any) => {
  isEditMode.value = true;
  isViewMode.value = false;
  editData.value = { ...employee };
  formDialog.value = true;
};

const viewEmployee = (employee: any) => {
  isEditMode.value = false;
  isViewMode.value = true;
  editData.value = { ...employee };
  formDialog.value = true;
};

const confirmDelete = async (id: number) => {
  try {

    await api.delete(`/employee/${id}`);
    ElMessage.success("Xodim muvaffaqiyatli o‘chirildi");
    fetchEmployees();
  } catch (e) {
    // cancel bo'lsa jim
  }
};

const handleSizeChange = (newSize: number) => {
  filterParams.value.pageSize = newSize;
  filterParams.value.currentPage = 1;
  fetchEmployees();
};

const handleCurrentChange = (newPage: number) => {
  filterParams.value.currentPage = newPage;
  fetchEmployees();
};

const handleSearch = () => {
  filterParams.value.currentPage = 1;
  fetchEmployees();
};
</script>
