<template>
  <div
    class="h-screen overflow-hidden bg-gray-50 dark:bg-[#1e222b] flex flex-col"
  >
    <UsersForm
      v-model:open="formDialog"
      :isEditMode="isEditMode"
      :editData="editData"
      @save="fetchUsers"
    />

    <!-- Sticky header + filter -->
    <div
      class="sticky top-0 z-20 border-b border-gray-200/60 dark:border-gray-700/60 bg-gray-50/80 dark:bg-[#1e222b] backdrop-blur"
    >
      <div class="p-6 flex flex-col gap-4">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h1
              class="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight"
            >
              {{ $t("user.title") }}
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ $t("user.description") }}
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

        <UsersFilter
          v-model="filterParams"
          :loading="loading"
          @refresh="fetchUsers"
          @openForm="openFormDialog()"
        />
      </div>
    </div>

    <!-- Content (flex-1 so list height stable) -->
    <div class="p-6 pt-4 flex-1 min-h-0">
      <div class="... h-full">
        <UsersList
          :data="paginatedUsers"
          :loading="loading"
          :page="filterParams.currentPage"
          :size="filterParams.pagSize"
          :total="filteredUsers.length"
          @view="openFormDialog"
          @delete="onDelete"
          @edit="openFormDialog"
          @page-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from "@/utils/axios";
import { Plus as ElIconPlus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

const users = ref<any[]>([]);
const loading = ref(false);

const formDialog = ref(false);
const isEditMode = ref(false);
const editData = ref<any>(null);

const filterParams = reactive({
  currentPage: 1,
  pagSize: 10,
  search: "",
});

const fetchUsers = async () => {
  try {
    loading.value = true;
    const response = await api.get("/user");
    users.value = response.data.data || [];
  } catch (error) {
    ElMessage.error("Userlarni yuklashda xatolik");
  } finally {
    loading.value = false;
  }
};

const openFormDialog = (editDataParam: any = null) => {
  isEditMode.value = !!editDataParam;
  editData.value = editDataParam;
  formDialog.value = true;
};

const onDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `${row.fullName || row.username} foydalanuvchisini o‘chirmoqchimisiz?`,
      "Tasdiqlash",
      {
        confirmButtonText: "Ha, o‘chirish",
        cancelButtonText: "Bekor qilish",
        type: "warning",
        // modal doim yuqorida turishi uchun:
        appendTo: document.body,
        // ixtiyoriy:
        closeOnClickModal: false,
        closeOnPressEscape: true,
      },
    );

    const id = row.id; // yoki row._id / row.uuid
    await api.delete(`/user/${id}`);
    ElMessage.success("User deleted successfully.");
    fetchUsers();
  } catch (err: any) {
    // cancel bo‘lsa shu yerga tushadi (xato deb ko‘rsatmaymiz)
    if (err === "cancel" || err === "close") return;
    ElMessage.error("Failed to delete user.");
  }
};

const handleSizeChange = (newSize: number) => {
  filterParams.pagSize = newSize;
  filterParams.currentPage = 1;
};

const handlePageChange = (newPage: number) => {
  filterParams.currentPage = newPage;
};

const filteredUsers = computed(() => {
  const q = (filterParams.search || "").toLowerCase().trim();
  if (!q) return users.value;
  return users.value.filter(
    (u: any) =>
      (u.fullName || "").toLowerCase().includes(q) ||
      (u.username || "").toLowerCase().includes(q),
  );
});

const paginatedUsers = computed(() => {
  const startIndex = (filterParams.currentPage - 1) * filterParams.pagSize;
  return filteredUsers.value.slice(
    startIndex,
    startIndex + filterParams.pagSize,
  );
});

watch(
  () => [filterParams.currentPage, filterParams.pagSize, filterParams.search],
  () => {
    // search bo'lsa page 1ga qaytarish
    if (filterParams.search) filterParams.currentPage = 1;
  },
);

onMounted(fetchUsers);
</script>
