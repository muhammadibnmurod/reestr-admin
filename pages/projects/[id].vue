<template>
  <ProjectDetailView :projectId="Number(route.params.id)" />
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import ProjectDetailView from "@/components/views/projects/detail/ProjectDetailView.vue";

const route = useRoute();
</script>
