<template>
  <Dialog v-model:visible="visible" modal :header="$t(headText)" :style="{ width: '25rem' }" @hide="emit('close')">
    <SkeletonUpsert v-if="isLoading" />
    <div v-else class="flex flex-column gap-3">
      <div class="flex flex-column gap-1">
        <label for="name">{{ $t("name") }} <span class="text-red-600">*</span> </label>
        <InputText
          id="name"
          class="w-full surface-100"
          v-model="form.name"
          :class="{ 'p-invalid': v$.form.name.$error }"
          :placeholder="$t('enter_name')"
        />
        <Message v-if="v$.form.name.$error" severity="error" size="small" variant="simple">{{ $errMes(v$.form.name) }}</Message>
      </div>
      <div class="flex flex-column gap-1">
        <label for="description">{{ $t("description") }} </label>
        <Textarea
          id="description"
          class="w-full surface-100"
          v-model="form.description"
          :placeholder="$t('enter_description')"
          autoResize
        />
      </div>
    </div>
    <template #footer>
      <Button :loading="loading" :label="$t('save')" @click="save()" />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, toRefs, computed } from "vue";
import { $errMes, $t } from "@/stores/helper";
import { required } from "@vuelidate/validators";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { getRequest, postRequest, putRequest } from "@/stores/request";
import { Dialog, Message, Textarea } from "primevue";
import useVuelidate from "@vuelidate/core";
import SkeletonUpsert from "@/components/SkeletonUpsert.vue";

const queryClient = useQueryClient();

const props = defineProps({
  item: { type: Object, default: () => ({}) },
});
const { item } = toRefs(props);

const emit = defineEmits(["close", "save"]);

const visible = ref(true);
const loading = ref(false);
const roles = computed(() => ({ form: { name: { required } } }));
const headText = computed(() => $t(`${item.value.id ? "edit" : "add"}_role`));

const { data, isLoading } = useQuery({
  queryKey: ["roleForm", item.value.id || "new"],
  queryFn: async () => {
    let res = !!item.value.id ? await getRequest(`auth/role/${item.value.id}`) : {};
    form.value = { ...res };
    return res;
  },
});
const form = ref(item.value.id ? { ...data.value } : {});
const v$ = useVuelidate(roles, { form });

const save = async () => {
  v$.value.$touch();
  if (v$.value.$invalid) return;
  loading.value = true;
  form.value.permissions = [];
  try {
    let res = item.value.id ? await putRequest(`auth/role/${item.value.id}`, form.value) : await postRequest("auth/role", form.value);
    queryClient.invalidateQueries({ queryKey: ["roles"] });
  } finally {
    loading.value = false;
    emit("close");
  }
};
</script>
