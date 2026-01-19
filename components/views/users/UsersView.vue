<template>
  <div class="flex flex-col gap-6 h-full p-6 bg-gray-8500">
    <UsersForm
      v-model:open="formDialog"
      :isEditMode="isEditMode"
      :editData="editData"
      @save="fetchUsers"
    />

    <div class="flex justify-between items-center pb-10">
      <h1 class="text-black dark:text-white text-3xl font-inter">
        {{ $t(`user.title`) }}
      </h1>

      <el-button
        :icon="ElIconPlus"
        type="primary"
        @click="openFormDialog()"
        class="!px-5 !py-5 !rounded-xl"
      >
        {{ $t("common.add") }}
      </el-button>
    </div>

    <!-- <UsersFilter

@openFormDialog="openFormDialog"

:filterParams="filterParams"

/> -->

    <div
      class="flex min-[500px] flex-col border-slate-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-[#1e222b] backdrop-blur-sm"
    >
      <UsersList
        :data="paginatedUsers"
        :page="filterParams.currentPage"
        :size="filterParams.pagSize"
        @delete="onDelete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import api from "@/utils/axios";

const users = ref([]);

const loading = ref(false);

const formDialog = ref(false);

const isEditMode = ref(false);

const editData = ref<any>(null);

// UserView.vue ichida

const fetchUsers = async () => {
  try {
    loading.value = true;

    const response = await api.get("/user");

    // Agar axios ishlatayotgan bo'lsangiz:

    // response.data - bu siz ko'rsatgan JSON ob'ekti

    // response.data.data - bu haqiqiy foydalanuvchilar massivi

    users.value = response.data.data || [];

    console.log("Users Loaded", users.value);
  } catch (error) {
    // ... xatolikni boshqarish
  } finally {
    loading.value = false;
  }
};

const filterParams = reactive({
  currentPage: 1,

  pagSize: 10,

  search: "dfgh",
});

const handleSizeChange = (newSize: number) => {
  filterParams.pagSize = newSize;

  fetchUsers();
};

const handlePageChange = (newPage: number) => {
  filterParams.currentPage = newPage;

  fetchUsers();
};

const openFormDialog = (editDataParam: any = null) => {
  isEditMode.value = !!editDataParam;

  editData.value = editDataParam;

  formDialog.value = true;
};

const onDelete = async (id: string) => {
  try {
    await api.delete(`user/${id}`);

    ElMessage.success({
      message: "User deleted successfully.",

      type: "success",

      duration: 3000,
    });

    fetchUsers();
  } catch (error) {
    console.error("Error deleting user:", error);

    ElMessage.error({
      message: "Failed to delete user.",

      type: "error",

      duration: 3000,
    });
  }
};

const paginatedUsers = computed(() => {
  const startIndex = (filterParams.currentPage - 1) * filterParams.pagSize;

  const endIndex = startIndex + filterParams.pagSize;

  return users.value.slice(startIndex, endIndex);
});

onMounted(() => {
  fetchUsers();
});
</script>
