<template>
  <div>
    <template v-for="i in count" :key="i">
      <div class="mb-3">
        <Skeleton width="50%" height="1.25rem" class=""></Skeleton>
        <Skeleton width="100%" height="2.5rem" class="mt-2"></Skeleton>
      </div>
    </template>
  </div>
  <Skeleton width="100%" height="2.5rem"></Skeleton>
</template>

<script setup>
import { Skeleton } from 'primevue';

const props = defineProps({
  count: { type: Number, default: 2 },
});
</script>
