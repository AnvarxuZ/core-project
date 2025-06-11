<template>
  <li :class="{ 'active-module-item': isActive }">
    <i class="text-3xl" :class="item.icon"></i>
    <span>{{ item.label }}</span>
  </li>
</template>

<script setup>
import { computed } from "vue";
import { useLayoutConfigStore } from "@/stores/layout_config";

const { layoutState } = useLayoutConfigStore();

const props = defineProps({
  item: { type: Object, required: true },
});

const isActive = computed(() => layoutState.activeModule?.key == props.item.key);
</script>
