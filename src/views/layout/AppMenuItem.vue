<template>
  <li class="">
    <router-link :to="item.to" :class="{ 'active-route': isActive }" tabindex="0" @click="itemClick(item)">
      <i :class="item.icon"></i>
      <span class="line-clamp-1 text-sm">{{ $t(item.label) }}</span>
    </router-link>
  </li>
</template>

<script setup>
import { computed } from "vue";
import { $t } from "@/stores/helper";
import { useLayoutConfigStore } from "@/stores/layout_config";

const { onMenuToggle, layoutState, setActiveModule, setActiveMenu } = useLayoutConfigStore();

const props = defineProps({
  item: { type: Object, required: true },
  module: { type: Object, required: true },
});

const isActive = computed(() => layoutState.activeMenu?.key == props.item.key);

const itemClick = (item) => {
  setActiveModule(props.module);
  setActiveMenu(item);
  // onMenuToggle();
};
</script>
