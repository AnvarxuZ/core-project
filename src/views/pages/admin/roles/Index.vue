<template>
  <div class="h-full flex flex-column">
    <DataTable :value="data" scrollable stripedRows :loading="isLoading" class="h-full flex flex-column overflow-hidden">
      <template #header>
        <div class="flex justify-content-between align-items-center">
          <p>{{ $t("roles") }}</p>
          <div class="w-6 flex gap-3">
            <InputText v-model="s" class="w-full" size="small" :placeholder="$t('search')" @input="getSearch" />
            <KpiSelect
              v-model="permission"
              class="w-15rem flex-shrink-0"
              query-key="permissions"
              size="small"
              link="auth/permission"
              show-clear
              filter
              @change="refetch"
              :placeholder="$t('select_permission')"
              v-tooltip.top="$t('filter_by_permission')"
            />
          </div>
          <div class="flex gap-3">
            <Button icon="pi pi-refresh" severity="secondary" @click="refresh" />
            <Button v-if="$assent('role-store')" icon="pi pi-plus-circle" :label="$t('add')" @click="addItem()" />
          </div>
        </div>
      </template>
      <template #empty>
        <div class="text-l text-center text-400">{{ $t("no_data") }}</div>
      </template>
      <template #loading>
        <div class="w-25rem surface-0 p-3 border-round shadow-8"><ProgressBar mode="indeterminate" style="height: 6px"></ProgressBar></div>
      </template>
      <Column field="id" header="№" class="w-3rem">
        <template #body="{ index }">{{ index + paginate.from || 1 }}</template>
      </Column>
      <Column field="name" :header="$t('name')"> </Column>
      <Column field="permission_count" :header="$t('permissions')" class="p-2">
        <template #body="{ data }">
          <Tag :value="data?.permissions?.length" severity="secondary"></Tag>
        </template>
      </Column>
      <Column field="description" :header="$t('description')" class="py-1">
        <template #body="{ data }">
          <div class="line-height-2">{{ data.description }}</div>
        </template>
      </Column>
      <Column field="action" class="p-1 text-right w-3rem">
        <template #header> <i v-if="isFetching" class="pi pi-spin pi-spinner mx-auto"></i> </template>
        <template #body="{ data }">
          <div class="flex">
            <div v-if="$assent('role-update')" v-tooltip.bottom="$t('sync_permission')">
              <Button icon="pi pi-key" text rounded size="small" severity="secondary" @click="syncPermission(data)" />
            </div>
            <div v-if="$assent('role-update')" v-tooltip.bottom="$t('edit')">
              <Button icon="pi pi-pen-to-square" text rounded size="small" severity="info" @click="edit(data)" />
            </div>
            <div v-if="$assent('role-destroy')" v-tooltip.bottom="$t('delete')">
              <Button icon="pi pi-trash" text rounded size="small" severity="danger" @click="deleteConfirm(data)" />
            </div>
          </div>
        </template>
      </Column>
    </DataTable>
    <Paginator :rows="paginate.perPage" :totalRecords="paginate.total" :rowsPerPageOptions="[20, 50, 100]" @page="getPaginate" />
  </div>

  <UpsertRole v-if="dialog_edit" :item="item" @close="dialog_edit = false" />
  <DialogSyncPermission v-if="dialog_sync_permissions" :item="item" @close="dialog_sync_permissions = false" />
  <ConfirmDialog></ConfirmDialog>
</template>

<script setup>
import { ref } from "vue";
import { $assent, $t } from "@/stores/helper";
import { deleteRequest, getRequest } from "@/stores/request";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { Button, Column, ConfirmDialog, DataTable, InputText, Paginator, ProgressBar, Tag, useConfirm, useToast } from "primevue";
import UpsertRole from "./UpsertRole.vue";
import KpiSelect from "@/components/KpiSelect.vue";
import DialogSyncPermission from "./DialogSyncPermission.vue";

const queryClient = useQueryClient();
const confirm = useConfirm();
const toast = useToast();

const s = ref("");
const permission = ref();
const sort = ref("id");
const item = ref();
const timer = ref();
const dialog_edit = ref(false);
const dialog_sync_permissions = ref(false);
const paginate = ref({ from: 1, page: 1, perPage: 20, total: 0 });

const fetchData = async () => {
  let loc_query = `?sort=${sort.value}&s=${s.value}&page=${paginate.value.page}&rows=${paginate.value.perPage}`;
  if (permission.value) loc_query += `&permissions=${permission.value}`;
  const response = await getRequest(`auth/role${loc_query}`);
  paginate.value = {
    from: response.meta.from,
    page: response.meta.current_page,
    perPage: response.meta.per_page,
    total: response.meta.total,
  };
  return response.data;
};
const { data, isLoading, isFetching, refetch } = useQuery({
  queryKey: ["roles"],
  queryFn: fetchData,
});
const refresh = () => {
  s.value = "";
  permission.value = null;
  queryClient.invalidateQueries({ queryKey: ["roles"] });
};
const getSearch = () => {
  clearTimeout(timer.value);
  timer.value = setTimeout(() => queryClient.invalidateQueries({ queryKey: ["roles"] }), 500);
};
const addItem = () => {
  item.value = {};
  dialog_edit.value = true;
};
const syncPermission = (data) => {
  item.value = data;
  dialog_sync_permissions.value = true;
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
      await deleteRequest(`auth/role/${data.id}`);
      queryClient.invalidateQueries({ queryKey: ["roles"] });
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
