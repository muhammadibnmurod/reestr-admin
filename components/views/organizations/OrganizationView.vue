<template>
  <div class="flex flex-col gap-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div class="flex justify-between items-center">
      <h1
        class="text-2xl font-extrabold text-gray-800 dark:text-white tracking-tight"
      >
        Organizations
      </h1>
      <el-button
        type="primary"
        :icon="Plus"
        @click="openFormDialog()"
        class="!rounded-lg !px-6 shadow-md"
      >
        Yangi qo'shish
      </el-button>
    </div>

    <OrganizationFilter
      v-model:search="filterParams.search"
      @search="fetchOrganizations"
    />

    <OrganizationList
      :organizations="organizations"
      :loading="loading"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <OrganizationForm
      v-model:open="formDialog"
      :isViewMode="isViewMode"
      :editData="editData"
      @save="fetchOrganizations"
    />
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

const organizations = ref([]);
const loading = ref(false);
const formDialog = ref(false);
const isViewMode = ref(false);
const editData = ref(null);

const filterParams = reactive({ search: "" });

const fetchOrganizations = async () => {
  loading.value = true;
  try {
    const { data } = await api.get("/organizations", {
      params: { search: filterParams.search },
    });
    organizations.value = data.data || [];
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
  editData.value = row;
  formDialog.value = true;
};

const handleEdit = (row: any) => {
  isViewMode.value = false;
  editData.value = row;
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

onMounted(fetchOrganizations);
</script>
