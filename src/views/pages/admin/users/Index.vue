<template>
  <div class="h-full flex flex-column">
    <DataTable :value="data" scrollable stripedRows :loading="isLoading" class="h-full flex flex-column overflow-hidden">
      <template #header>
        <div class="flex flex-wrap justify-content-between align-items-center gap-2">
          <p>{{ $t("users") }}</p>
          <div class="w-6 flex gap-2 min-w-max">
            <FloatLabel variant="on" class="w-full min-w-max">
              <InputText id="search" v-model="s" class="w-full" size="small" @input="getSearch" />
              <label for="search">{{ $t("search") }}</label>
            </FloatLabel>
          </div>
          <div class="flex gap-3">
            <Button icon="pi pi-refresh" severity="secondary" @click="refresh" />
            <Button v-if="$assent('user-store')" icon="pi pi-plus-circle" :label="$t('add')" @click="addItem" />
          </div>
        </div>
      </template>
      <template #empty>
        <div class="text-l text-center text-400">{{ $assent("user-index") ? $t("no_data") : $t("no_access") }}</div>
      </template>
      <template #loading>
        <div class="w-25rem surface-0 p-3 border-round shadow-8"><ProgressBar mode="indeterminate" style="height: 6px"></ProgressBar></div>
      </template>
      <Column field="id" header="№" class="w-3rem">
        <template #body="{ index }">{{ index + paginate.from }}</template>
      </Column>
      <Column field="username" :header="$t('username')"></Column>
      <Column field="employee" :header="$t('employee')">
        <template #body="{ data }">
          <KPIEmployee :employee="data.employee" />
        </template>
      </Column>
      <Column field="roles" :header="$t('roles')" class="py-1">
        <template #body="{ data }">
          <div class="flex flex-wrap gap-2">
            <template v-for="(item, index) in data.roles" :key="index">
              <Tag :value="item.name" severity="info"></Tag>
            </template>
          </div>
        </template>
      </Column>
      <Column field="action" class="p-1 text-right w-3rem">
        <template #header> <i v-if="isFetching" class="pi pi-spin pi-spinner mx-auto"></i> </template>
        <template #body="{ data }">
          <div class="flex">
            <div v-if="$assent('user-update_role')" v-tooltip.bottom="$t('sync_roles')">
              <Button icon="pi pi-key" text rounded size="small" severity="secondary" @click="syncRoles(data)" />
            </div>
            <div v-if="$assent('user-update_password')" v-tooltip.bottom="$t('set_new_password')">
              <Button icon="pi pi-wrench" text rounded size="small" severity="secondary" @click="setPass(data)" />
            </div>
            <div v-if="$assent('user-update')" v-tooltip.bottom="$t('edit')">
              <Button icon="pi pi-user-edit" text rounded size="small" severity="info" @click="edit(data)" />
            </div>
            <div v-if="$assent('user-destroy')" v-tooltip.bottom="$t('delete')">
              <Button icon="pi pi-trash" text rounded size="small" severity="danger" @click="deleteConfirm(data)" />
            </div>
          </div>
        </template>
      </Column>
    </DataTable>
    <Paginator
      v-if="paginate.total > 20"
      :rows="paginate.perPage"
      :totalRecords="paginate.total"
      :rowsPerPageOptions="[20, 50, 100]"
      @page="getPaginate"
    />
  </div>

  <UpsertUser v-if="dialog_edit" :item="item" @close="dialog_edit = false" />
  <DialogSetPassword v-if="dialog_set_pass" :item="item" @close="dialog_set_pass = false" />
  <DialogSyncRoles v-if="dialog_sync_roles" :item="item" @close="dialog_sync_roles = false" />
  <ConfirmDialog></ConfirmDialog>
</template>

<script setup>
import { ref, computed } from "vue";
import { $assent, $t } from "@/stores/helper";
import { deleteRequest, getRequest } from "@/stores/request";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { ConfirmDialog, FloatLabel, Paginator, ProgressBar, Tag, useConfirm, useToast } from "primevue";
import UpsertUser from "./UpsertUser.vue";
import DialogSyncRoles from "./DialogSyncRoles.vue";
import KPIEmployee from "@/components/KPIEmployee.vue";
import DialogSetPassword from "./DialogSetPassword.vue";

const queryClient = useQueryClient();
const confirm = useConfirm();
const toast = useToast();

const s = ref("");
const item = ref();
const timer = ref();
const sort = ref("id");
const filters = ref({});
const dialog_edit = ref(false);
const dialog_set_pass = ref(false);
const dialog_sync_roles = ref(false);
const dialog_sync_location = ref(false);
const paginate = ref({ from: 1, page: 1, perPage: 20, total: 0 });

const filterParams = computed(() => {
  let params = ``;
  if (filters.value.role_id) params += `roles=${filters.value.role_id}&`;
  if (filters.value.station_id) params += `stations=${filters.value.station_id}&`;
  if (filters.value.location_id) params += `locations=${filters.value.location_id}&`;
  if (filters.value.permission_id) params += `permissions=${filters.value.permission_id}&`;
  return params.slice(0, -1);
});

const fetchUsers = async () => {
  let loc_query = `?sort=${sort.value}&s=${s.value}&page=${paginate.value.page}&rows=${paginate.value.perPage}`;
  if (filterParams.value) loc_query += `&${filterParams.value}`;
  const response = await getRequest(`auth/user${loc_query}`);
  paginate.value = {
    from: response.meta.from,
    page: response.meta.current_page,
    perPage: response.meta.per_page,
    total: response.meta.total,
  };
  return response.data;
};
const { data, isLoading, isFetching, refetch } = useQuery({
  queryKey: ["users"],
  queryFn: fetchUsers,
  enabled: $assent("user-index"),
  retry: false,
});

const refresh = () => {
  s.value = "";
  filters.value = {};
  queryClient.invalidateQueries({ queryKey: ["users"] });
};
const getSearch = () => {
  clearTimeout(timer.value);
  timer.value = setTimeout(() => queryClient.invalidateQueries({ queryKey: ["users"] }), 500);
};
const syncRoles = (data) => {
  item.value = data;
  dialog_sync_roles.value = true;
};
const syncLocation = (data) => {
  item.value = data;
  dialog_sync_location.value = true;
};
const setPass = (data) => {
  item.value = data;
  dialog_set_pass.value = true;
};
const addItem = () => {
  item.value = null;
  dialog_edit.value = true;
};
const edit = (data) => {
  item.value = data;
  dialog_edit.value = true;
};
const deleteConfirm = (data) => {
  confirm.require({
    message: `${$t("do_you_want_to_delete_this_record")}?`,
    header: $t("confirm_delete"),
    icon: "pi pi-info-circle",
    rejectLabel: $t("cancel"),
    rejectProps: { label: $t("cancel"), severity: "secondary", outlined: true },
    acceptProps: { label: $t("delete"), severity: "danger" },
    accept: async () => {
      await deleteRequest(`auth/user/${data.id}`);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.add({ severity: "success", summary: $t("successfully_deleted"), life: 3000 });
    },
  });
};
const getPaginate = (event) => {
  paginate.value.page = event.page + 1;
  paginate.value.perPage = event.rows;
  refetch();
};
</script>
