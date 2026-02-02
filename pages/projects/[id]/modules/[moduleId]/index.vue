<template>
  <div class="p-6 bg-gray-50 dark:bg-gray-900 h-screen overflow-hidden">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Submodules</h1>
    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
      projectId: {{ projectId }} | moduleId: {{ moduleId }}
    </p>

    <div class="mt-6">
      <SubmodulesSection :module-id="moduleId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const projectId = computed(() => Number(route.params.id));
const moduleId = computed(() => Number(route.params.moduleId));
</script>
