<template>
  <v-list-item base-color="teal" @click="openDialog()">
    <v-icon icon="mdi-attachment" />
    <v-tooltip activator="parent" location="top center"> 附件管理 </v-tooltip>
  </v-list-item>
  <v-dialog v-model="dialog" width="50vh">
    <v-card class="pa-5">
      <div class="d-flex justify-between align-center">
        <v-icon icon="mdi-attachment" size="35" color="teal"></v-icon>
        <v-chip :label="true" class="mx-2" color="teal">
          <span class="font-weight-bold text-h6">附件管理</span>
        </v-chip>
      </div>
      <AttachmentCard
        v-if="attachmentStore.fileSize"
        :file-name="attachmentStore.fileName"
        :file-size="attachmentStore.fileSize"
        class="mt-5"
      />
      <div class="d-flex justify-center mt-5 mr-2">
        <v-btn
          prepend-icon="mdi-attachment-remove"
          :flat="true"
          class="ml-3"
          color="warning"
          variant="tonal"
          :block="true"
          @click="deleteAttachment()"
          >清除已有附件</v-btn
        >
      </div>
      <div class="d-flex justify-center align-center mt-5">
        <v-file-input
          v-model="files"
          density="compact"
          label="更新附件"
          variant="solo-filled"
          hide-details
          :single-line="true"
          :flat="true"
        ></v-file-input>
        <v-btn :flat="true" class="ml-3" color="primary" @click="uploadAttachment()"
          >上传</v-btn
        >
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useSnackBarStore } from "~/store/snackBar";
import { useAttachmentStore } from "~/store/attachment";
import AttachmentCard from "@/components/admin/challenges/attachment/AttachmentCard.vue";

const attachmentStore = useAttachmentStore();
const snackBarStore = useSnackBarStore();
const dialog = ref(false);
const files: Ref<Array<File>> = ref([]);

interface Props {
  item: Challenge;
}
const props = defineProps<Props>();

async function openDialog() {
  await attachmentStore.getAttachmentInfo(props.item.id);
  files.value = [];
  dialog.value = true;
}

async function deleteAttachment() {
  interface Response {
    code: number;
  }
  const { data: res } = await useAuthFetch(
    `/media/challenges/attachments/${props.item.id}`,
    {
      method: "DELETE",
    }
  );
  const resObj = res.value as Response;
  if (resObj.code === 200) {
    snackBarStore.showSnackbar("附件清除成功", "success");
    await attachmentStore.getAttachmentInfo(props.item.id);
  } else {
    snackBarStore.showSnackbar("附件清除失败", "error");
  }
}

async function uploadAttachment() {
  interface Response {
    code: number;
    msg: string;
  }
  if (files.value[0]) {
    const formData = new FormData();
    formData.append("attachment", files.value[0]);
    const { data: res } = await useAuthFetch(
      `/media/challenges/attachments/${props.item.id}`,
      {
        method: "POST",
        body: formData,
      }
    );
    const resObj = res.value as Response;
    if (resObj.code === 200) {
      snackBarStore.showSnackbar("附件上传成功", "success");
      await attachmentStore.getAttachmentInfo(props.item.id);
    } else {
      snackBarStore.showSnackbar("附件上传失败\n" + resObj.msg, "error");
    }
  } else {
    snackBarStore.showSnackbar("请选择文件再上传", "error");
  }
}
</script>
