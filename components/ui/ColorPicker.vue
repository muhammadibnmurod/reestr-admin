<template>
  <div
    class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
  >
    <div class="flex items-center gap-3 flex-wrap">
      <!-- Picker -->
      <el-color-picker v-model="colorModel" :disabled="disabled" class="!m-0" />

      <!-- Manual input -->
      <el-input
        v-model="colorModel"
        :disabled="disabled"
        placeholder="#2563eb"
        maxlength="7"
        class="w-40"
        @blur="normalizeColor"
      >
        <template #prefix>#</template>
      </el-input>

      <!-- Preview -->
      <div
        class="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700"
        :style="{ backgroundColor: colorModel }"
        title="Preview"
      />
    </div>

    <!-- Presets -->
    <div class="mt-4">
      <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">
        Tayyor ranglar:
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="c in presets"
          :key="c"
          type="button"
          :disabled="disabled"
          class="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 hover:scale-105 transition"
          :style="{ backgroundColor: c }"
          @click="colorModel = c"
        />
      </div>
    </div>

    <div v-if="!isValidHex(colorModel)" class="mt-3 text-xs text-red-500">
      Hex rang noto‘g‘ri. Masalan: #2563eb
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  modelValue: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: string): void;
}>();

const presets = [
  "#2563eb",
  "#4f46e5",
  "#7c3aed",
  "#db2777",
  "#dc2626",
  "#ea580c",
  "#ca8a04",
  "#16a34a",
  "#059669",
  "#0891b2",
  "#0d9488",
  "#6b7280",
  "#1f2937",
];

const colorModel = computed({
  get: () => props.modelValue || "#2563eb",
  set: (v) => emit("update:modelValue", v),
});

const isValidHex = (v: string) => /^#[0-9A-Fa-f]{6}$/.test(v);

const normalizeColor = () => {
  // foydalanuvchi "2563eb" deb yozsa ham # qo‘shib yuboramiz
  let v = (colorModel.value || "").trim();
  if (v && !v.startsWith("#")) v = "#" + v;
  // 3 ta hex yozsa (#fff) -> #ffffff qilib yuborish ham mumkin, lekin hozir shart emas
  colorModel.value = v;
};
</script>
