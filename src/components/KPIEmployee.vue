<template>
  <div class="flex gap-2 align-items-center">
    <Avatar
      :label="avatar_label"
      class="flex-shrink-0"
      shape="circle"
      style="background-color: var(--p-blue-500); color: var(--p-surface-0)"
    />
    <div class="">
      <p class="line-clamp-1">{{ employee.first_name }} {{ employee.last_name }}</p>
      <span class="text-sm text-400 line-clamp-1">{{ text || employee.tabel || "" }}</span>
    </div>
  </div>
</template>

<script setup>
import { Avatar } from "primevue";
import { toRefs } from "vue";
import { computed } from "vue";

const props = defineProps({
  employee: { type: Object, default: () => ({}) },
  size: { type: String, default: "" },
  text: { type: String, default: "" },
});
const { employee, size } = toRefs(props);

const avatar_label = computed(() =>
  `${employee.value.first_name?.charAt(0) || ""}${employee.value.last_name?.charAt(0) || ""}`.toUpperCase()
);
</script>
