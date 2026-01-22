<template>
  <div class="color-picker-container">
    <div class="flex items-center gap-4 flex-wrap">
      <!-- Custom Color Input -->
      <div class="flex items-center gap-3">
        <div class="relative">
          <input
            type="color"
            :value="modelValue"
            @input="handleColorInput"
            :disabled="disabled"
            class="color-input"
          />
          <div
            class="color-preview"
            :style="{ backgroundColor: modelValue }"
            @click="!disabled && triggerColorPicker()"
          >
            <el-icon v-if="!disabled" class="text-white drop-shadow-lg">
              <Edit />
            </el-icon>
          </div>
        </div>
        
        <div class="flex flex-col">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Tanlangan rang
          </span>
          <span class="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {{ modelValue }}
          </span>
        </div>
      </div>

      <!-- Divider -->
      <div class="h-12 w-px bg-gray-300 dark:bg-gray-600"></div>

      <!-- Preset Colors -->
      <div class="flex-1">
        <div class="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">
          Tayyor ranglar:
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <el-tooltip
            v-for="color in presetColors"
            :key="color.value"
            :content="color.name"
            placement="top"
          >
            <button
              type="button"
              :disabled="disabled"
              class="preset-color"
              :class="{
                'preset-color-active': modelValue === color.value,
                'preset-color-disabled': disabled
              }"
              :style="{ backgroundColor: color.value }"
              @click="selectColor(color.value)"
            >
              <el-icon v-if="modelValue === color.value" class="text-white">
                <Check />
              </el-icon>
            </button>
          </el-tooltip>
        </div>
      </div>
    </div>

    <!-- Color Info -->
    <div class="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
      <div class="flex items-start gap-2">
        <el-icon class="text-blue-500 mt-0.5"><InfoFilled /></el-icon>
        <div class="text-xs text-gray-600 dark:text-gray-400">
          <p class="font-medium mb-1">Rang tanlash bo'yicha maslahat:</p>
          <ul class="list-disc list-inside space-y-1">
            <li>Brand rangingizga mos rang tanlang</li>
            <li>Yaxshi kontrast uchun to'q ranglarni tanlang</li>
            <li>Tayyor ranglardan tanlashingiz yoki o'z rangingizni kiritishingiz mumkin</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Check, Edit, InfoFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const props = defineProps<{
  modelValue: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

// Preset colors with names
const presetColors = ref([
  { name: "Ko'k (Blue)", value: "#2563eb" },
  { name: "Indigo", value: "#4f46e5" },
  { name: "Binafsha (Purple)", value: "#7c3aed" },
  { name: "Pushti (Pink)", value: "#db2777" },
  { name: "Qizil (Red)", value: "#dc2626" },
  { name: "To'q qizil (Crimson)", value: "#be123c" },
  { name: "Apelsin (Orange)", value: "#ea580c" },
  { name: "Sariq (Yellow)", value: "#ca8a04" },
  { name: "Yashil (Green)", value: "#16a34a" },
  { name: "To'q yashil (Emerald)", value: "#059669" },
  { name: "Moviy (Cyan)", value: "#0891b2" },
  { name: "Ko'k-yashil (Teal)", value: "#0d9488" },
  { name: "Kulrang (Gray)", value: "#6b7280" },
  { name: "Qora (Black)", value: "#1f2937" },
  { name: "Jigarrang (Brown)", value: "#92400e" },
  { name: "Pushti-qizil (Rose)", value: "#e11d48" },
]);

const colorInputRef = ref<HTMLInputElement>();

const handleColorInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const newColor = target.value;
  
  if (isValidHexColor(newColor)) {
    emit("update:modelValue", newColor);
    ElMessage.success("Rang o'zgartirildi");
  }
};

const selectColor = (color: string) => {
  if (props.disabled) return;
  
  emit("update:modelValue", color);
  ElMessage.success("Rang tanlandi");
};

const triggerColorPicker = () => {
  const colorInput = document.querySelector('.color-input') as HTMLInputElement;
  colorInput?.click();
};

const isValidHexColor = (color: string): boolean => {
  return /^#[0-9A-F]{6}$/i.test(color);
};
</script>

<style scoped>
.color-picker-container {
  @apply bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700;
}

.color-input {
  @apply absolute opacity-0 w-0 h-0 pointer-events-none;
}

.color-preview {
  @apply w-16 h-16 rounded-xl border-4 border-gray-200 dark:border-gray-600 cursor-pointer;
  @apply flex items-center justify-center transition-all duration-200;
  @apply hover:scale-110 hover:shadow-lg;
  @apply relative overflow-hidden;
}

.color-preview::before {
  content: '';
  @apply absolute inset-0 bg-black opacity-0 transition-opacity duration-200;
}

.color-preview:hover::before {
  @apply opacity-20;
}

.preset-color {
  @apply w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600;
  @apply cursor-pointer transition-all duration-200;
  @apply hover:scale-110 hover:shadow-md;
  @apply flex items-center justify-center;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

.preset-color-active {
  @apply border-4 border-white dark:border-gray-800 shadow-lg scale-110;
  @apply ring-2 ring-blue-500 dark:ring-blue-400;
}

.preset-color-disabled {
  @apply opacity-50 cursor-not-allowed;
}

.preset-color:not(.preset-color-disabled):hover {
  @apply ring-2 ring-gray-400 dark:ring-gray-500;
}

/* Animation for color change */
@keyframes colorPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.color-preview {
  animation: colorPulse 2s ease-in-out infinite;
}

.preset-color-active {
  animation: colorPulse 1s ease-in-out infinite;
}
</style>