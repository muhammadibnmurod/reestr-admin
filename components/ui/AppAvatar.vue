<template>
  <el-avatar
    :size="size"
    :src="computedSrc"
    :class="
      cn(
        'flex-shrink-0 border-2 border-slate-200 dark:border-slate-700 shadow-md font-semibold text-white bg-gradient-to-br transition-all duration-200 hover:scale-105',
        roleClass,
        props.class,
      )
    "
  >
    <span v-if="!computedSrc" class="text-sm">{{ fallbackText }}</span>
  </el-avatar>
</template>

<script setup lang="ts">
import { cn } from "@/lib/utils";

const props = defineProps({
  src: String,
  name: { type: String, default: "U" },
  size: { type: Number, default: 40 },
  role: { type: String, default: "user" },
  class: String,
});

const computedSrc = computed(() => {
  // Agar src yo'q yoki "none" bo'lsa, undefined qaytarish
  if (
    !props.src ||
    props.src === "none" ||
    props.src === "string" ||
    props.src.trim() === ""
  ) {
    return undefined;
  }

  // Agar to'liq URL bo'lsa, o'sha URL ni qaytarish
  if (props.src.startsWith("http://") || props.src.startsWith("https://")) {
    return props.src;
  }


  // Aks holda backend base URL bilan birlashtirish
  const baseUrl = 'https://reestr.das-uty.uz/api'
  // baseUrl oxirida "/" bo'lsa, olib tashlash
  const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  // src boshida "/" bo'lsa, olib tashlash
  const cleanSrc = props.src.startsWith("/") ? props.src.slice(1) : props.src;

  return `${cleanBase}/${cleanSrc}`;
});

const fallbackText = computed(() => props.name.charAt(0).toUpperCase());

const roleClass = computed(() => {
  if (props.role === "admin") {
    return "from-red-500 to-rose-600";
  }
  return "from-blue-500 to-indigo-600";
});
</script>
