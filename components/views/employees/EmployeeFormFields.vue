<template>
  <div class="grid grid-cols-1 gap-6">
    <div class="card">
      <div class="card-head">
        <div class="card-title">
          <div class="card-ico-wrapper">
            <el-icon class="card-ico"><User /></el-icon>
          </div>
          <div>
            <div class="ttl">F.I.O</div>
            <div class="sub">Xodimning to‘liq ismi (4 tilda)</div>
          </div>
        </div>

        <el-tabs v-model="activeNameLang" class="lang-tabs" type="card">
          <el-tab-pane label="O‘zb" name="uz" />
          <el-tab-pane label="Eng" name="en" />
          <el-tab-pane label="Рус" name="ru" />
          <el-tab-pane label="Кир" name="kr" />
        </el-tabs>
      </div>

      <el-form-item :prop="fullNameProp" class="m-0">
        <el-input
          v-model="fullName"
          :placeholder="fioPlaceholder"
          clearable
          class="modern-inp"
        />
      </el-form-item>
    </div>

    <div class="card">
      <div class="card-head">
        <div class="card-title">
          <div class="card-ico-wrapper">
            <el-icon class="card-ico"><Briefcase /></el-icon>
          </div>
          <div>
            <div class="ttl">Lavozim</div>
            <div class="sub">Xodim lavozimi (4 tilda)</div>
          </div>
        </div>

        <el-tabs v-model="activePosLang" class="lang-tabs" type="card">
          <el-tab-pane label="O‘zb" name="uz" />
          <el-tab-pane label="Eng" name="en" />
          <el-tab-pane label="Рус" name="ru" />
          <el-tab-pane label="Кир" name="kr" />
        </el-tabs>
      </div>

      <el-form-item :prop="positionProp" class="m-0">
        <el-input
          v-model="position"
          :placeholder="positionPlaceholder"
          clearable
          class="modern-inp"
        />
      </el-form-item>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { User, Briefcase } from "@element-plus/icons-vue";

const props = defineProps<{
  modelValue: {
    fullNameUz: string;
    fullNameEn: string;
    fullNameRu: string;
    fullNameKiril: string;
    positionUz: string;
    positionEn: string;
    positionRu: string;
    positionKiril: string;
  };
}>();

const emit = defineEmits(["update:modelValue"]);

/* ========= F.I.O Mantiqi ========= */
const activeNameLang = ref<"uz" | "en" | "ru" | "kr">("uz");

const fullNameProp = computed(() => {
  const map = { uz: 'fullNameUz', en: 'fullNameEn', ru: 'fullNameRu', kr: 'fullNameKiril' };
  return map[activeNameLang.value];
});

const fullName = computed({
  get: () => {
    const map = { uz: 'fullNameUz', en: 'fullNameEn', ru: 'fullNameRu', kr: 'fullNameKiril' };
    return props.modelValue[map[activeNameLang.value] as keyof typeof props.modelValue];
  },
  set: (v: string) => {
    const map = { uz: 'fullNameUz', en: 'fullNameEn', ru: 'fullNameRu', kr: 'fullNameKiril' };
    emit("update:modelValue", { ...props.modelValue, [map[activeNameLang.value]]: v });
  },
});

const fioPlaceholder = computed(() => {
  const titles = { uz: "Familiya Ism Sharif", en: "Full Name", ru: "ФИО", kr: "Фамилия Исм Шариф" };
  return titles[activeNameLang.value];
});

/* ========= Lavozim Mantiqi ========= */
const activePosLang = ref<"uz" | "en" | "ru" | "kr">("uz");

const positionProp = computed(() => {
  const map = { uz: 'positionUz', en: 'positionEn', ru: 'positionRu', kr: 'positionKiril' };
  return map[activePosLang.value];
});

const position = computed({
  get: () => {
    const map = { uz: 'positionUz', en: 'positionEn', ru: 'positionRu', kr: 'positionKiril' };
    return props.modelValue[map[activePosLang.value] as keyof typeof props.modelValue];
  },
  set: (v: string) => {
    const map = { uz: 'positionUz', en: 'positionEn', ru: 'positionRu', kr: 'positionKiril' };
    emit("update:modelValue", { ...props.modelValue, [map[activePosLang.value]]: v });
  },
});

const positionPlaceholder = computed(() => {
  const titles = { uz: "Masalan: Dasturchi", en: "e.g. Developer", ru: "Например: Программист", kr: "Масалан: Дастурчи" };
  return titles[activePosLang.value];
});
</script>

<style scoped>
.card {
  @apply rounded-2xl border border-gray-100 dark:border-gray-800 
         bg-gray-50/50 dark:bg-gray-800/30 p-5 transition-all duration-300;
}

.card:hover {
  @apply border-blue-200 dark:border-blue-900/50 bg-white dark:bg-gray-800/50 shadow-sm;
}

.card-head {
  @apply flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5;
}

.card-title {
  @apply flex items-center gap-3;
}

.card-ico-wrapper {
  @apply w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center 
         shadow-sm border border-gray-100 dark:border-gray-700;
}

.card-ico {
  @apply text-blue-600 dark:text-blue-400 text-lg;
}

.ttl {
  @apply text-sm font-bold text-gray-900 dark:text-white leading-none;
}

.sub {
  @apply text-xs text-gray-500 dark:text-gray-400 mt-1;
}

/* Tabs dizayni */
.lang-tabs :deep(.el-tabs__header) {
  @apply m-0 border-none;
}

.lang-tabs :deep(.el-tabs__nav) {
  @apply border-none bg-gray-100 dark:bg-gray-900 rounded-lg p-1;
}

.lang-tabs :deep(.el-tabs__item) {
  @apply !h-7 !leading-7 text-[11px] font-bold rounded-md px-3 border-none transition-all;
  @apply text-gray-500 dark:text-gray-400;
}

.lang-tabs :deep(.el-tabs__item.is-active) {
  @apply bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm;
}

/* Input dizayni */
.modern-inp :deep(.el-input__wrapper) {
  @apply !rounded-xl !shadow-none bg-white dark:bg-gray-900
         border border-gray-200 dark:border-gray-700 h-12 px-4;
}

.modern-inp :deep(.el-input__wrapper.is-focus) {
  @apply border-blue-500 ring-4 ring-blue-500/10;
}

.m-0 {
  margin-bottom: 0 !important;
}
</style>