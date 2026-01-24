<template>
  <div
    class="flex flex-col gap-6 h-full p-6 bg-gray-50 dark:bg-gray-900"
    v-loading="pageLoading"
  >
    <!-- Header -->
    <div
      class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700"
    >
      <div class="flex items-center gap-4">
        <el-button :icon="ArrowLeft" circle size="large" @click="goBack" />

        <div>
          <h1 class="text-black dark:text-white text-3xl font-inter font-bold">
            {{ headerTitle }}
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ headerSubtitle }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <el-tag
          v-if="mode !== 'create'"
          :type="mode === 'edit' ? 'warning' : 'success'"
        >
          {{ mode.toUpperCase() }}
        </el-tag>
      </div>
    </div>

    <!-- Form -->
    <div class="flex-1 min-h-0 overflow-y-auto">
      <div class="max-w-6xl mx-auto">
        <ProjectForm
          ref="formApiRef"
          v-model="form"
          :mode="mode"
          :loading="saveLoading"
          :employees="employees"
          :employeesLoading="empLoading"
          @submit="onSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { ArrowLeft } from "@element-plus/icons-vue";
import api from "@/utils/axios";

import ProjectForm from "./ProjectForm.vue";

type Mode = "create" | "edit" | "view";

type Employee = {
  id: number;
  fullName?: string;
  fullNameUz?: string;
  username?: string;
  image?: string;
};

const employees = ref<Employee[]>([]);
const empLoading = ref(false);

type ProjectFormModel = {
  nameUz: string;
  nameRu: string;
  nameEn: string;
  nameKiril: string;

  descriptionUz: string;
  descriptionRu: string;
  descriptionEn: string;
  descriptionKiril: string;

  logo: string;

  startDate: string | null; // ISO string
  endDate: string | null; // ISO string

  status: string;
  pmId: number | null;
  price: number | null;
};

const props = defineProps<{
  mode: Mode;
  projectId?: number;
}>();

const router = useRouter();

const pageLoading = ref(false);
const saveLoading = ref(false);

const formApiRef = ref<InstanceType<typeof ProjectForm> | null>(null);

const form = ref<ProjectFormModel>({
  nameUz: "",
  nameRu: "",
  nameEn: "",
  nameKiril: "",

  descriptionUz: "",
  descriptionRu: "",
  descriptionEn: "",
  descriptionKiril: "",

  logo: "",

  startDate: null,
  endDate: null,

  status: "pending",
  pmId: null,
  price: null,
});

const headerTitle = computed(() => {
  if (props.mode === "create") return "Yangi loyiha yaratish";
  if (props.mode === "edit") return "Loyihani tahrirlash";
  return "Loyiha ma’lumotlari";
});

const headerSubtitle = computed(() => {
  if (props.mode === "create") return "Yangi loyiha qo‘shish";
  if (props.mode === "edit") return "Loyiha ma’lumotlarini yangilash";
  return "Loyiha haqida batafsil ma’lumot";
});

const goBack = () => {
  router.push("/projects");
};

const fetchProject = async () => {
  if (!props.projectId) return;

  pageLoading.value = true;
  try {
    const res = await api.get(`/project/${props.projectId}`);
    const data = res.data?.data ?? res.data;

    form.value = {
      nameUz: data?.nameUz || "",
      nameRu: data?.nameRu || "",
      nameEn: data?.nameEn || "",
      nameKiril: data?.nameKiril || "",

      descriptionUz: data?.descriptionUz || "",
      descriptionRu: data?.descriptionRu || "",
      descriptionEn: data?.descriptionEn || "",
      descriptionKiril: data?.descriptionKiril || "",

      logo: data?.logo || "",

      startDate: data.startDate ? data.startDate.slice(0, 10) : "",
      endDate: data.endDate ? data.endDate.slice(0, 10) : "",
      status: data.status ?? "pending",
      price: data.price ?? null,


      pmId: data.pm?.id ?? null,
    };
  } catch (e: any) {
    ElMessage.error(e.response?.data?.message || "Loyihani yuklashda xatolik");
    goBack();
  } finally {
    pageLoading.value = false;
  }
};

const fetchEmployees = async () => {
  empLoading.value = true;
  try {
    const res = await api.get("/employee");

    employees.value = res.data?.data?.data || res.data?.data || res.data || [];
  } catch (e) {
    employees.value = [];
  } finally {
    empLoading.value = false;
  }
};

onMounted(async () => {
  if (props.mode === "edit" && props.projectId) {
    await fetchProject();
  } else {
    await fetchEmployees();
  }
});


const normalizeDate = (val: any) => {
  if (!val) return null;
  // el-date-picker Date qaytarishi mumkin
  if (val instanceof Date) return val.toISOString();
  // ISO bo‘lsa
  if (typeof val === "string") return val;
  return null;
};

const onSubmit = async () => {
  if (props.mode === "view") return;

  // child form validate
  const ok = await formApiRef.value?.validate?.();
  if (!ok) return;

  saveLoading.value = true;
  try {
    const payload = {
      ...form.value,
      startDate: normalizeDate(form.value.startDate),
      endDate: normalizeDate(form.value.endDate),
      pmId: form.value.pmId ?? 0,
      price: Number(form.value.price ?? 0),
    };

    if (props.mode === "edit" && props.projectId) {
      await api.put(`/project/${props.projectId}`, payload);
      ElMessage.success("Loyiha muvaffaqiyatli yangilandi");
      router.push(`/projects/${props.projectId}?mode=view`);
      return;
    }

    const res = await api.post("/project", payload);

    // backend qaysi formatda qaytarishiga moslashamiz:
    const created = res.data?.data ?? res.data;
    const newId = created?.id ?? created?.data?.id;

    ElMessage.success("Loyiha muvaffaqiyatli yaratildi");
    if (newId) {
      router.push(`/projects/${newId}?mode=edit`);
    } else {
      router.push("/projects");
    }
  } catch (e: any) {
    ElMessage.error(e.response?.data?.message || "Saqlashda xatolik");
  } finally {
    saveLoading.value = false;
  }
};
</script>
