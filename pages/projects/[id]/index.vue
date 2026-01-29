<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Left: main card -->
    <div
      class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700"
    >
      <div class="flex items-start gap-4">
        <div
          class="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 overflow-hidden flex items-center justify-center"
        >
          <img
            v-if="logoUrl"
            :src="logoUrl"
            class="w-full h-full object-cover"
          />
          <div v-else class="text-gray-400 text-xs">No logo</div>
        </div>

        <div class="flex-1">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                {{ project?.nameUz || "-" }}
              </h2>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {{ project?.nameEn || "" }}
              </p>
            </div>

            <span
              class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
              :class="statusBadgeClass(project?.status)"
            >
              {{ project?.status || "-" }}
            </span>
          </div>

          <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <InfoItem
              label="Boshlanish"
              :value="formatDate(project?.startDate)"
            />
            <InfoItem label="Tugash" :value="formatDate(project?.endDate)" />
            <InfoItem label="Narx" :value="formatMoney(project?.price)" />
          </div>
        </div>
      </div>

      <!-- Description -->
      <div
        class="mt-6 border-t border-gray-200/70 dark:border-gray-700/70 pt-5"
      >
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
          Tavsif (UZ)
        </h3>
        <p
          class="text-sm text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-line"
        >
          {{ project?.descriptionUz || "-" }}
        </p>

        <div v-if="project?.descriptionEn" class="mt-4">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
            Description (EN)
          </h3>
          <p
            class="text-sm text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-line"
          >
            {{ project?.descriptionEn }}
          </p>
        </div>
      </div>
    </div>

    <!-- Right: PM + progress -->
    <div
      class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700"
    >
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
        Project Manager
      </h3>

      <div class="mt-4 flex items-center gap-3">
        <el-avatar :size="46" :src="pmImageUrl" />
        <div class="min-w-0">
          <div class="font-semibold text-gray-900 dark:text-white truncate">
            {{ pmName }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            PM ID: {{ project?.pmId ?? "-" }}
          </div>
        </div>
      </div>

      <div class="mt-6">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Progress
        </h3>
        <el-progress :percentage="Number(project?.completionPercent || 0)" />
        <div class="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Yopilgan tasklar / umumiy tasklar keyin modules/submodules bo‘limidan
          hisoblaymiz.
        </div>
      </div>

      <div
        class="mt-6 border-t border-gray-200/70 dark:border-gray-700/70 pt-4"
      >
        <InfoItem
          label="Yaratilgan sana"
          :value="formatDateTime(project?.createdAt)"
        />
        <InfoItem
          label="Yangilangan"
          :value="formatDateTime(project?.updatedAt)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  project: any | null;
  pm?: any | null; // backend project.pm bo‘lsa
}>();

const getImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `https://reestr.das-uty.uz/api/${path}`;
};

const logoUrl = computed(() => getImageUrl(props.project?.logo));

const pmName = computed(() => {
  // pm object bo‘lsa shundan, bo‘lmasa fallback
  return props.pm?.fullNameUz || props.pm?.fullName || "PM tanlanmagan";
});

const pmImageUrl = computed(() => getImageUrl(props.pm?.image));

const formatDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString("uz-UZ") : "-";
const formatDateTime = (d?: string) =>
  d ? new Date(d).toLocaleString("uz-UZ") : "-";

const formatMoney = (v?: number) => {
  if (v === null || v === undefined) return "-";
  try {
    return new Intl.NumberFormat("uz-UZ").format(Number(v)) + " so‘m";
  } catch {
    return String(v);
  }
};

const statusBadgeClass = (status?: string) => {
  const s = (status || "").toLowerCase();
  if (s === "done" || s === "completed")
    return "bg-green-500/10 text-green-500";
  if (s === "active" || s === "started") return "bg-blue-500/10 text-blue-500";
  if (s === "pending") return "bg-amber-500/10 text-amber-600";
  return "bg-gray-500/10 text-gray-600 dark:text-gray-300";
};
</script>

<script lang="ts">
import { defineComponent } from "vue";

// tiny local component
const InfoItem = defineComponent({
  props: { label: String, value: String },
  template: `
    <div class="rounded-xl bg-gray-50 dark:bg-gray-900/40 p-3 border border-gray-100 dark:border-gray-700">
      <div class="text-xs text-gray-500 dark:text-gray-400">{{ label }}</div>
      <div class="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{{ value }}</div>
    </div>
  `,
});
</script>
