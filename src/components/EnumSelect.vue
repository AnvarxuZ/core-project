import KpiSelect from './KpiSelect.vue'; import KpiSelect from './KpiSelect.vue';
<template>
    <KpiSelect
      v-model="value"
      v-bind="{ ...props }"
      :options="data || []"
      @update:modelValue="emit('update:modelValue', $event)"
      @change="emit('change', $event)"
    >
      <template #option="{ option }"> {{ $t(option.name) }} </template>
    </KpiSelect>
</template>

<script setup>
import { ref } from "vue";
import { $t } from "@/stores/helper";
import { useQuery } from "@tanstack/vue-query";
import { getRequest } from "@/stores/request";
import KpiSelect from "./KpiSelect.vue";
import { toRefs } from "vue";
import { watch } from "vue";

const props = defineProps({
  modelValue: { type: [String, Number], default: "" },
  options: { type: Array, default: () => [] },
  optionLabel: { type: String, default: "name" },
  optionValue: { type: String, default: "code" },
  placeholder: { type: String, default: $t("select") },
  queryKey: { type: String, default: "enumData" },
  link: { type: String, default: "" },
  showClear: { type: Boolean, default: false },
});
const { modelValue, link, queryKey } = toRefs(props);
const emit = defineEmits(["update:modelValue", "change"]);

const value = ref(modelValue.value);

watch(modelValue, (newValue) => {
  value.value = newValue;
});

const fetchOptions = async () => {
  if (link.value === "") return [];
  const response = await getRequest(`enum/${link.value}`);
  return response.map((i) => ({ ...i, name: $t(i.name) }));
};
const { data, isLoading, isFetching } = useQuery({
  queryKey: [queryKey.value],
  queryFn: fetchOptions,
  retry: false,
});
</script>
