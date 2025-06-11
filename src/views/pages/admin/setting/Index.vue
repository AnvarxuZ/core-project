<template>
  <div class="h-full flex flex-column gap-3">
    <div class="flex align-items-center p-2">{{ $t("company_setting") }}</div>
    <div class="h-full flex flex-column">
      <div class="surface-0 p-3 border-round">
        <div class="grid">
          <div class="col-6 lg:col-3 flex flex-column gap-2">
            <label for="name">{{ $t("company_name") }}</label>
            <InputText id="name" v-model="company.name" class="w-full" :class="{ 'p-invalid': v$.company.name.$error }" />
            <Message v-if="v$.company.name.$error" severity="error" size="small" variant="simple">
              {{ $errMes(v$.company.name) }}
            </Message>
          </div>
          <!-- max kpi percent -->
          <div class="col-6 lg:col-3 flex flex-column gap-2">
            <label for="max_kpi_percent">{{ $t("max_kpi_percent") }}</label>
            <InputNumber
              input-id="max_kpi_percent"
              v-model="company.max_kpi_percent"
              input-class="w-full"
              :invalid="v$.company.max_kpi_percent.$error"
              :min="0"
              :max="100"
            />
            <Message v-if="v$.company.max_kpi_percent.$error" severity="error" size="small" variant="simple">
              {{ $errMes(v$.company.max_kpi_percent) }}
            </Message>
          </div>
          <!-- target_due_day -->
          <div class="col-6 lg:col-3 flex flex-column gap-2">
            <label for="target_due_day">{{ $t("target_due_day") }}</label>
            <InputNumber
              input-id="target_due_day"
              v-model="company.target_due_day"
              input-class="w-full"
              :invalid="v$.company.target_due_day.$error"
              :min="0"
              :max="31"
            />
            <Message v-if="v$.company.target_due_day.$error" severity="error" size="small" variant="simple">
              {{ $errMes(v$.company.target_due_day) }}
            </Message>
          </div>
          <!-- report_due_day -->
          <div class="col-6 lg:col-3 flex flex-column gap-2">
            <label for="report_due_day">{{ $t("report_due_day") }}</label>
            <InputNumber
              input-id="report_due_day"
              v-model="company.report_due_day"
              input-class="w-full"
              :invalid="v$.company.report_due_day.$error"
              :min="0"
              :max="31"
            />
            <Message v-if="v$.company.report_due_day.$error" severity="error" size="small" variant="simple">
              {{ $errMes(v$.company.report_due_day) }}
            </Message>
          </div>
        </div>
      </div>
    </div>
    <div class="surface-0 p-2 border-round flex align-items-center justify-content-between">
      <div></div>
      <Button label="Save" :loading="loading" @click="save()" size="small" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { $t, $errMes } from "@/stores/helper";
import { putRequest } from "@/stores/request";
import { useLayoutStore } from "@/stores/layout";
import { InputNumber, Message, useToast } from "primevue";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

const { profile, getProfile } = useLayoutStore();
const toast = useToast();

const loading = ref(false);
const company = ref(profile?.company || {});
const roles = computed(() => ({
  company: {
    name: { required },
    max_kpi_percent: { required },
    target_due_day: { required },
    report_due_day: { required },
  },
}));
const v$ = useVuelidate(roles, { company });

const save = async () => {
  v$.value.$touch();
  if (v$.value.$invalid) return;
  loading.value = true;
  await putRequest(`admin/company-setting/${company.value.id}`, { ...company.value });
  toast.add({ severity: "success", summary: $t("successfully_saved"), life: 3000 });
  await getProfile();
  loading.value = false;
};
</script>
