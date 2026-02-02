<template>
  <div
    class="h-screen overflow-hidden bg-gray-50 dark:bg-[#1e222b] flex flex-col"
  >
    <UsersForm
      v-model:open="formDialog"
      :isViewMode="mode === 'view'"
      :isEditMode="mode === 'edit'"
      :editData="editData"
      @save="fetchUsers"
    />

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
            @click="openCreate"
            class="!px-5 !py-2 !rounded-xl shadow-md"
          >
            {{ $t("common.add") }}
          </el-button>
        </div>

        <UsersFilter
          v-model="filterParams"
          :loading="loading"
          @refresh="fetchUsers"
        />
      </div>
    </div>

    <div class="p-6 pt-4 flex-1 min-h-0">
      <div class="h-full">
        <UsersList
          :data="paginatedUsers"
          :loading="loading"
          :page="filterParams.currentPage"
          :size="filterParams.pagSize"
          :total="filteredUsers.length"
          @view="openView"
          @delete="onDelete"
          @edit="openEdit"
          @page-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from "vue";
import api from "@/utils/axios";
import { Plus as ElIconPlus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

const users = ref<any[]>([]);
const loading = ref(false);
const formDialog = ref(false);
const editData = ref<any>(null);
const mode = ref<"view" | "edit" | "create">("create");

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

const openCreate = () => {
  mode.value = "create";
  editData.value = null;
  formDialog.value = true;
};

const openEdit = (row: any) => {
  mode.value = "edit";
  editData.value = row;
  formDialog.value = true;
};

const openView = (row: any) => {
  mode.value = "view";
  editData.value = row;
  formDialog.value = true;
};

const onDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `${row.fullName || row.username} foydalanuvchisini o‘chirmoqchimisiz?`,
      "Tasdiqlash",
      { confirmButtonText: "Ha", cancelButtonText: "Yo'q", type: "warning" },
    );
    await api.delete(`/user/${row.id}`);
    ElMessage.success("Muvaffaqiyatli o'chirildi");
    fetchUsers();
  } catch (err) {
    if (err !== "cancel") ElMessage.error("Xatolik yuz berdi");
  }
};

const filteredUsers = computed(() => {
  const q = (filterParams.search || "").toLowerCase().trim();
  if (!q) return users.value;
  return users.value.filter(
    (u) =>
      (u.fullName || "").toLowerCase().includes(q) ||
      (u.username || "").toLowerCase().includes(q),
  );
});

const paginatedUsers = computed(() => {
  const start = (filterParams.currentPage - 1) * filterParams.pagSize;
  return filteredUsers.value.slice(start, start + filterParams.pagSize);
});

const handlePageChange = (p: number) => (filterParams.currentPage = p);
const handleSizeChange = (s: number) => {
  filterParams.pagSize = s;
  filterParams.currentPage = 1;
};

onMounted(fetchUsers);
</script>
s