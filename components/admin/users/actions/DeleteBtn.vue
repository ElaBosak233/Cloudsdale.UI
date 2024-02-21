<template>
  <v-list-item base-color="error" @click="dialog = true">
    <v-icon icon="mdi-delete" />
    <v-tooltip activator="parent" location="top center"> 删除 </v-tooltip>
  </v-list-item>
  <v-dialog v-model="dialog" width="50vh">
    <v-card class="pa-5">
      <div class="d-flex justify-between align-center">
        <v-icon icon="mdi-account-minus" size="35" color="error"></v-icon>
        <v-chip :label="true" class="mx-2" color="error">
          <span class="font-weight-bold text-h6">用户删除</span>
        </v-chip>
      </div>
      <div class="d-flex justify-center pt-5">
        <span class="text-md-body-1"
          >用户将被永久删除，是否继续？<span class="font-italic font-weight-bold"
            >（真的很久！）</span
          ></span
        >
      </div>
      <div class="d-flex justify-end pt-5">
        <v-btn variant="flat" color="error" class="mx-1" @click="dialog = false"
          >取消</v-btn
        >
        <v-btn variant="flat" color="primary" class="mx-1" @click="deleteUser(item?.id)"
          >确定</v-btn
        >
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useAuthFetch } from "@/composables/useAuthFetch";
import { useSnackBarStore } from "~/store/snackBar";

const snackBarStore = useSnackBarStore();
const dialog = ref(false);

interface Props {
  item: User;
}
defineProps<Props>();

const emit = defineEmits(["finished"]);

async function deleteUser(id: number) {
  interface Response {
    code: number;
  }
  const { data: res } = await useAuthFetch(`/users/`, {
    method: "DELETE",
    body: {
      id,
    },
  });
  const resObj = res.value as Response;
  if (resObj?.code === 200) {
    snackBarStore.showSnackbar("用户删除成功", "success");
    emit("finished");
  }
}
</script>
