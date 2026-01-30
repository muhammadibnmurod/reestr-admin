<template>
  <AssignmentsView />
</template>

<script setup lang="ts">
import AssignmentsView from '~/components/views/assignments/AssignmentsView.vue';

definePageMeta({
  breadcrumb: {
    title: 'Assignments',
    to: `/projects`,
  },
});
</script>
