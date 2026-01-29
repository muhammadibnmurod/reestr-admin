<template>
  <ProjectDocumentsSection :readonly="readonly" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const readonly = computed(() => route.query.mode === "view");
</script>
