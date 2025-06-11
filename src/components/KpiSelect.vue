<template>
  <Select
    v-model="value"
    :name="queryKey"
    :options="getOptions"
    :optionLabel="optionLabel"
    :optionValue="optionValue"
    :placeholder="placeholder"
    :filterFields="[...filterFields.split(',')]"
    :filter="filter"
    :showClear="showClear"
    autoFilterFocus
    fluid
    @change="change"
    @filter="filterItems"
  >
    <template #value="{ value }">
      <slot name="value" :value="value"></slot>
    </template>
    <template #option="{ option }">
      <slot name="option" :option="option"></slot>
    </template>
  </Select>
</template>

<script setup>
import { Select } from "primevue";
import { $t } from "@/stores/helper";
import { ref, toRefs, computed } from "vue";
import { getRequest } from "@/stores/request";
import { useQuery } from "@tanstack/vue-query";
import { useQueryClient } from "vue-query";
import { watch } from "vue";

const queryClient = useQueryClient();

const props = defineProps({
  modelValue: { type: [String, Number], default: "" },
  options: { type: Array, default: () => [] },
  optionLabel: { type: String, default: "name" },
  optionValue: { type: String, default: "id" },
  placeholder: { type: String, default: $t("select") },
  queryKey: { type: String, default: "items" },
  link: { type: String, default: "" },
  filter: { type: Boolean, default: false },
  filterFields: { type: String, default: () => "name" },
  showClear: { type: Boolean, default: false },
  params: { type: String, default: "" },
  rows: { type: Number, default: 50 },
  isSelectFirst: { type: Boolean, default: false },
  clearAfterSelection: { type: Boolean, default: false },
});
const { modelValue, link, queryKey, options, params, rows, clearAfterSelection } = toRefs(props);
const emit = defineEmits(["update:modelValue", "change"]);

const s = ref(null);
const timeout = ref(null);
const item = ref(null);
const value = ref(modelValue.value);

watch(modelValue, () => {
  value.value = modelValue.value;
  const obj = getOptions.value.find((i) => i[props.optionValue] == modelValue.value);
  if (obj) item.value = obj;
  else item.value = null;
});

const fetchOptions = async () => {
  if (link.value === "") return [];
  let loc_params = `rows=${rows.value || 50}`;
  if (params.value) loc_params += `&${params.value}`;
  if (s.value) loc_params += `&s=${s.value}`;
  const response = await getRequest(`${link.value}?${loc_params}`).then((res) => res.data || res);
  if (modelValue.value) !response.find((o) => o[props.optionValue] == modelValue.value) && getItem();
  else if (props.isSelectFirst) {
    value.value = response[0][props.optionValue] || null;
    change({ value: value.value, data: response[0] });
  }
  return response;
};
const { data, isLoading, isFetching, refetch } = useQuery({
  queryKey: [queryKey],
  queryFn: fetchOptions,
  retry: false,
});
const getOptions = computed(() => {
  if (options.value.length) return options.value;
  let items = Array.isArray(data.value) ? [...data.value] : [];
  if (item.value) items = [{ ...item.value }, ...items.filter((i) => i[props.optionValue] !== item.value[props.optionValue])];
  return items;
});

const change = (e) => {
  emit("update:modelValue", e.value);
  const selectedOption = getOptions.value.find((o) => o[props.optionValue] === e.value) || null;
  if (e.data || selectedOption) emit("change", e.data || selectedOption);
  else emit("change");
  setTimeout(() => {
    if (clearAfterSelection.value) value.value = null;
  }, 100);
};
const getItem = async () => {
  const response = await getRequest(`${link.value}/${modelValue.value}`);
  if (response) {
    item.value = response;
    change({ value: value.value, data: response });
  } else value.value = null;
};
const filterItems = (e) => {
  clearTimeout(timeout.value);
  timeout.value = setTimeout(() => {
    s.value = e.value;
    refetch();
  }, 500);
};
</script>
