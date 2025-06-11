<template>
  <div class="surface-100 border-round h-full flex align-items-center justify-content-center">
    <div class="surface-0 w-10 xl:w-6 border-1 border-round border-200 p-6">
      <Button :label="$t('return_to_back')" outlined @click="router.back()" />
    </div>
  </div>
</template>

<script setup>
import { $t } from "@/stores/helper";
import { useRouter } from "vue-router";

const router = useRouter();
</script>
