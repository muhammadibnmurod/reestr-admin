<template>
  <div class="flex flex-col gap-6 h-full p-6 bg-gray-50 dark:bg-gray-900">
    <EmployeesForm
      v-model:open="formDialog"
      :isEditMode="isEditMode"
      :isViewMode="isViewMode"
      :editData="editData"
      @save="fetchEmployees"
    />

    <div class="flex justify-between items-center pb-4">
      <h1 class="text-black dark:text-white text-3xl font-inter font-bold">
        {{ $t('employee.title') }}
      </h1>
      <el-button
        :icon="ElIconPlus"
        type="primary"
        @click="openFormDialog()"
        class="!px-5 !py-3 !rounded-xl"
      >
        {{ $t("common.add") }}
      </el-button>
    </div>

    <EmployeesFilter
      v-model:search="filterParams.search"
      @search="handleSearch"
    />

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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { Plus as ElIconPlus } from '@element-plus/icons-vue';
import api from '@/utils/axios';
import EmployeesForm from './EmployeesForm.vue';
import EmployeesFilter from './EmployeesFilter.vue';
import EmployeesList from './EmployeesList.vue';

const employees = ref([]);
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
  search: '',
});

const fetchEmployees = async () => {
  loading.value = true;
  try {
    const response = await api.get('/employee', {
      params: {
        page: filterParams.value.currentPage,
        size: filterParams.value.pageSize,
        'full-name': filterParams.value.search || undefined,
      },
    });
    
    employees.value = response.data.data.data;
    totalPages.value = response.data.data.totalPage;
    totalRecords.value = response.data.data.totalPage * filterParams.value.pageSize;
  } catch (error) {
    console.error('Error fetching employees:', error);
    ElMessage.error('Xodimlarni yuklashda xatolik yuz berdi');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchEmployees();
});

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
    await ElMessageBox.confirm(
      'Ushbu xodimni o\'chirmoqchimisiz?',
      'Ogohlantirish',
      {
        confirmButtonText: 'Ha',
        cancelButtonText: 'Bekor qilish',
        type: 'warning',
      }
    );
    await onDelete(id);
  } catch (error) {
    // Bekor qilindi
  }
};

const onDelete = async (id: number) => {
  try {
    await api.delete(`/employee/${id}`);
    ElMessage.success('Xodim muvaffaqiyatli o\'chirildi');
    fetchEmployees();
  } catch (error) {
    console.error('Error deleting employee:', error);
    ElMessage.error('Xodimni o\'chirishda xatolik yuz berdi');
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