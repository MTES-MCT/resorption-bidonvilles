<template>
    <FilePreviewList
        :files="attachments"
        :allowDeletion="isOwnerOfQuestion"
        @deleteFile="onDeleteAttachment"
    />
</template>

<script setup>
import { toRefs } from "vue";
import { FilePreviewList } from "@resorptionbidonvilles/ui";
import { useAttachmentsStore } from "@/stores/attachments.store";

const props = defineProps({
    questionId: Number,
    attachments: Array,
});
const { attachments, questionId } = toRefs(props);
const isOwnerOfQuestion = false;

function onDeleteAttachment(file) {
    const attachmentStore = useAttachmentsStore();
    attachmentStore.deleteQuestionAttachment(file, {
        questionId: questionId.value,
    });
}
</script>
