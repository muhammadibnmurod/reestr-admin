<template>
  <el-dialog
    v-model="dialogVisible"
    :title="
      isViewMode
        ? 'Organization Ma\'lumotlari'
        : editData?.id
          ? 'Tahrirlash'
          : 'Yangi Organization'
    "
    width="600px"
    destroy-on-close
    class="rounded-2xl"
  >
    <div class="p-2">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        :disabled="isViewMode"
      >
        <el-tabs v-model="activeTab" class="mb-4">
          <el-tab-pane label="O'zbekcha" name="uz">
            <el-form-item label="Name (UZ)" prop="name.uz">
              <el-input
                v-model="form.name.uz"
                placeholder="Nomini kiriting..."
              />
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="English" name="en">
            <el-form-item label="Name (EN)" prop="name.en">
              <el-input v-model="form.name.en" placeholder="Enter name..." />
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="Русский" name="ru">
            <el-form-item label="Name (RU)" prop="name.ru">
              <el-input
                v-model="form.name.ru"
                placeholder="Введите название..."
              />
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="Кирилл" name="krill">
            <el-form-item label="Name (KRILL)" prop="name.krill">
              <el-input
                v-model="form.name.krill"
                placeholder="Номини киритинг..."
              />
            </el-form-item>
          </el-tab-pane>
        </el-tabs>

        <div class="grid grid-cols-1 gap-4 mt-4 border-t pt-4">
          <el-form-item label="Parent Organization" prop="parentId">
            <el-select
              v-model="form.parentId"
              placeholder="Parent organization tanlang"
              clearable
              filterable
              class="w-full"
              :disabled="isViewMode"
            >
              <el-option
                v-for="org in parentOptions"
                :key="org.id"
                :value="org.id"
                :label="useGetTranslation(org.name)"
              />
            </el-select>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <el-button @click="dialogVisible = false">
          {{ isViewMode ? "Yopish" : "Bekor qilish" }}
        </el-button>
        <el-button
          v-if="!isViewMode"
          type="primary"
          :loading="loading"
          @click="onSubmit"
          class="!px-8"
        >
          Saqlash
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, reactive, computed } from "vue";
import api from "@/utils/axios";
import { ElMessage } from "element-plus";

const props = defineProps<{
  open: boolean;
  isViewMode?: boolean;
  editData?: any;
  organizations: any[];
}>();

const emit = defineEmits(["update:open", "save"]);

const formRef = ref();
const loading = ref(false);
const activeTab = ref("uz");

const form = reactive({
  name: { uz: "", en: "", ru: "", krill: "" },
  parentId: null as number | null,
});

const parentOptions = computed(() => {
  const selfId = props.editData?.id;
  return (props.organizations || []).filter((o: any) => o.id !== selfId);
});

const rules = {
  "name.uz": [{ required: true, trigger: "blur" }],
  "name.en": [{ required: true, trigger: "blur" }],
};

const dialogVisible = computed({
  get: () => props.open,
  set: (val) => emit("update:open", val),
});

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen && props.editData) {
      Object.assign(form.name, props.editData.name);
      form.parentId = props.editData.parentId || null;
    } else if (isOpen) {
      form.name = { uz: "", en: "", ru: "", krill: "" };
      form.parentId = null;
    }
  },
);

const onSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return;
    loading.value = true;
    const payload = {
      name: form.name,
      parentId: form.parentId ?? 0,
    };

    try {
      if (props.editData?.id) {
        await api.put(`/organizations/${props.editData.id}`, payload);
      } else {
        await api.post("/organizations", payload);
      }
      ElMessage.success("Muvaffaqiyatli saqlandi");
      emit("save");
      dialogVisible.value = false;
    } catch (error: any) {
      ElMessage.error(error.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      loading.value = false;
    }
  });
};
</script>
