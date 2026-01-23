<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sticky Header -->
    <div
      class="sticky top-0 z-10 border-b border-gray-200/60 dark:border-gray-700/60 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur"
    >
      <div class="flex flex-col gap-3 p-6">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h1
              class="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight"
            >
              Organizations
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Tashkilotlar ro‘yxati, parent bog‘lanishlar, qidiruv va amallar.
            </p>
          </div>

          <el-button
            type="primary"
            :icon="Plus"
            @click="openFormDialog()"
            class="!rounded-xl !px-5 !py-2 shadow-md"
          >
            Yangi qo‘shish
          </el-button>
        </div>

        <OrganizationFilter
          v-model:search="params.search"
          @search="handleSearch"
        />
      </div>
    </div>

    <!-- Content -->
    <div class="p-6 pt-4">
      <OrganizationList
        :organizations="organizations"
        :loading="loading"
        :total="totalRecords"
        :currentPage="params.page"
        :pageSize="params.size"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDelete"
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
      />

      <OrganizationForm
        v-model:open="formDialog"
        :isViewMode="isViewMode"
        :editData="editData"
        :organizations="organizations"
        @save="fetchOrganizations"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { Plus } from "@element-plus/icons-vue";
import api from "@/utils/axios";
import { ElMessage, ElMessageBox } from "element-plus";
import OrganizationList from "./OrganizationList.vue";
import OrganizationForm from "./OrganizationForm.vue";
import OrganizationFilter from "./OrganizationFilter.vue";

const organizations = ref<any[]>([]);
const loading = ref(false);
const formDialog = ref(false);
const isViewMode = ref(false);
const editData = ref<any>(null);

const totalRecords = ref(0);

const params = reactive({
  page: 1,
  size: 10,
  search: "",
});

const fetchOrganizations = async () => {
  loading.value = true;
  try {
    const { data } = await api.get("/organizations", {
      params: {
        page: params.page,
        size: params.size,
        search: params.search || undefined,
      },
    });

    const list = data?.data?.data ?? data?.data ?? [];
    const totalPage = data?.data?.totalPage ?? 1;

    organizations.value = list;

    // Total records backend qaytarmasa projects’dagi usul:
    totalRecords.value = totalPage * params.size;
  } catch (error) {
    ElMessage.error("Ma'lumotlarni yuklashda xatolik");
  } finally {
    loading.value = false;
  }
};

const openFormDialog = () => {
  isViewMode.value = false;
  editData.value = null;
  formDialog.value = true;
};

const handleView = (row: any) => {
  isViewMode.value = true;
  editData.value = { ...row };
  formDialog.value = true;
};

const handleEdit = (row: any) => {
  isViewMode.value = false;
  editData.value = { ...row };
  formDialog.value = true;
};

const handleDelete = (id: number) => {
  ElMessageBox.confirm("Haqiqatdan ham o'chirmoqchimisiz?", "Ogohlantirish", {
    confirmButtonText: "Ha",
    cancelButtonText: "Yo'q",
    type: "warning",
  }).then(async () => {
    try {
      await api.delete(`/organizations/${id}`);
      ElMessage.success("O'chirildi");
      fetchOrganizations();
    } catch (error) {
      ElMessage.error("O'chirishda xatolik");
    }
  });
};

// Pagination handlers
const handlePageChange = (page: number) => {
  params.page = page;
  fetchOrganizations();
};

const handleSizeChange = (size: number) => {
  params.size = size;
  params.page = 1;
  fetchOrganizations();
};

const handleSearch = () => {
  params.page = 1;
  fetchOrganizations();
};

onMounted(fetchOrganizations);
</script>
