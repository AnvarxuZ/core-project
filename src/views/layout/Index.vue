<template>
  <div class="h-full flex flex-column overflow-hidden">
    <template v-if="!isLoading">
      <Container />
    </template>
  </div>
</template>

<script setup>
import { useLayoutStore } from "@/stores/layout";
import { useQuery } from "@tanstack/vue-query";
import Container from "./Container.vue";

const layout = useLayoutStore();

const { data, isLoading } = useQuery({ queryKey: ["profile"], queryFn: layout.getProfile });
</script>
