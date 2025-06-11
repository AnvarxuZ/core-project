<template>
  <Dialog v-model:visible="visible" modal :header="$t('sync_roles')" :style="{ width: '50rem' }" @hide="emit('close')">
    <div class="h-full flex flex-column gap-3">
      <div class="flex justify-content-between align-items-center gap-3">
        <div>{{ item.first_name }} {{ item.last_name }}</div>
      </div>
      <div class="grid">
        <template v-if="isLoading">
          <div class="col-6 flex align-items-center">
            <Skeleton width="1.7rem" height="1.7rem" />
            <Skeleton height="1.2rem" class="mx-2" />
          </div>
        </template>
        <template v-for="(role, index) in items" :key="index">
          <div class="col-3">
            <div class="flex align-items-center">
              <Checkbox :input-id="`role_${index}`" v-model="role.checked" :binary="true" />
              <label :for="`role_${index}`" class="ml-2 line-clamp-1"> {{ role.name }} </label>
              <i v-if="role.description" class="ml-1 ong-warning text-300 cursor-pointer" v-tooltip.top="$t(role.description)"></i>
            </div>
          </div>
        </template>
      </div>
    </div>
    <template #footer>
      <Button :loading="loading" :label="$t('save')" @click="save()" />
    </template>
  </Dialog>
</template>

<script setup>
import { $t } from "@/stores/helper";
import { ref, toRefs, computed } from "vue";
import { Checkbox, Dialog, Skeleton } from "primevue";
import { getRequest, putRequest } from "@/stores/request";
import { useQuery, useQueryClient } from "@tanstack/vue-query";

const queryClient = useQueryClient();

const props = defineProps({
  item: { type: Object, default: () => ({}) },
});
const { item } = toRefs(props);
const emit = defineEmits(["close"]);

const visible = ref(true);
const loading = ref(false);

const user_roles = computed(() => item.value.roles?.map((v) => v.name) || []);

const { data, isLoading } = useQuery({
  queryKey: ["roles"],
  queryFn: async () => {
    let res = await getRequest("auth/role");
    items.value = res.data?.map((v) => ({ ...v, checked: user_roles.value.includes(v.name) }));
    return res.data;
  },
  retry: false,
});
const items = ref([...(data.value?.map((v) => ({ ...v, checked: user_roles.value.includes(v.name) })) || [])]);

const save = async () => {
  loading.value = true;
  let _data = items.value.filter((v) => v.checked).map((v) => v.name);
  try {
    await putRequest(`auth/user-update-role/${item.value.id}`, { roles: _data });
    queryClient.invalidateQueries({ queryKey: ["users"] });
    emit("close");
  } finally {
    loading.value = false;
  }
};
</script>
