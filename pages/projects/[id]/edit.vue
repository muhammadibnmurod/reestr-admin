<template>
  <ProjectFormView mode="edit" :projectId="Number(route.params.id)" />
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import ProjectFormView from "@/components/views/projects/form/ProjectFormView.vue";

const route = useRoute();
</script>
