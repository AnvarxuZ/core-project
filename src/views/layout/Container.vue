<template>
  <div class="layout-wrapper" :class="containerClass">
    <Sidebar />
    <div class="layout-main-container">
      <div class="h-full flex flex-column overflow-hidden">
        <Topbar />
        <div class="h-full flex flex-column p-3 overflow-hidden">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import Sidebar from "./Sidebar.vue";
import Topbar from "./Topbar.vue";
import { useLayoutConfigStore } from "@/stores/layout_config";

const { layoutState } = useLayoutConfigStore();

const containerClass = computed(() => {
  return {
    "layout-overlay": layoutState.isMenuActive,
  };
});
</script>
