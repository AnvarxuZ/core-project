<template>
  <div class="" @click="toggle">
    <div class="p-select p-component w-full" :class="additionalClass">
      <span class="p-select-label" :class="{ 'p-placeholder': !value[0] && !value[1] }">
        {{ DateFormatter(value[0], format) }}
        <template v-if="value[0] && value[1]">-</template>
        {{ DateFormatter(value[1], format) }}
        <template v-if="!value[0] && !value[1]">{{ placeholder }} {{ value[0] }}</template>
      </span>
    </div>
    <Select v-show="false" />

    <Popover ref="op" @hide="emit('hide')">
      <div class="flex gap-3">
        <div class="flex flex-column gap-2">
          <label for="from">From</label>
          <DatePicker v-model="value[0]" :size="size" :dateFormat="dateFormat" :view="view" :min-date="minDate" placeholder="select date" />
          <DatePicker v-model="value[0]" v-if="!noTime" :size="size" timeOnly fluid placeholder="select time" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="to">To</label>
          <DatePicker
            v-model="value[1]"
            :size="size"
            :dateFormat="dateFormat"
            :view="view"
            :min-date="value[0]"
            :max-date="maxDate"
            placeholder="select date"
            @date-select="toDate"
          />
          <DatePicker v-model="value[1]" v-if="!noTime" :size="size" timeOnly fluid placeholder="select time" />
        </div>
      </div>
      <div class="mt-2 text-right">
        <Button :size="size" label="Save" @click="save"></Button>
      </div>
    </Popover>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { computed } from "vue";
import { DateFormatter } from "@/stores/helper";
import { DatePicker, Popover, Select } from "primevue";
import { toRefs } from "vue";
import { watch } from "vue";

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  placeholder: { type: String, default: "Select date" },
  size: { type: String, default: "" },
  dateFormat: { type: String, default: "dd.mm.yy" },
  view: { type: String, default: "date" },
  noTime: { type: Boolean, default: false },
  format: { type: String, default: "dateTime" },
  maxDate: { type: Date, default: null },
  minDate: { type: Date, default: null },
  inputClass: { type: String, default: "" },
});
const { modelValue } = toRefs(props);
const emit = defineEmits(["update:modelValue", "hide"]);

const op = ref();
const value = ref([...modelValue.value]);

const additionalClass = computed(() => {
  let cls = "";
  if (props.size == "small") cls += `p-select-sm`;
  if (props.inputClass) cls += ` ${props.inputClass}`;
  return cls;
});

watch(modelValue, (newValue) => (value.value = [...newValue]));

const toggle = (event) => {
  op.value.toggle(event);
};
const change = () => {
  emit("update:modelValue", value.value);
  emit("hide");
};
const save = () => {
  op.value.hide();
  change();
};
const toDate = (event) => {
  value.value[1] = new Date(new Date(value.value[1]).setHours(23, 59, 59, 0));
};
</script>
