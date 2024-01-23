<template>
    <FilePreviewList
        :files="attachments"
        :allowDeletion="canModerate"
        @deleteFile="onDeleteAttachment"
    />
</template>

<script setup>
import { toRefs } from "vue";
import { FilePreviewList } from "@resorptionbidonvilles/ui";
import { useAttachmentsStore } from "@/stores/attachments.store";

const props = defineProps({
    questionId: Number,
    canModerate: {
        type: Boolean,
        default: false,
    },
    attachments: Array,
});
const { attachments, canModerate, questionId } = toRefs(props);

function onDeleteAttachment(file) {
    const attachmentStore = useAttachmentsStore();
    attachmentStore.deleteQuestionAttachment(file, {
        questionId: questionId.value,
    });
}
</script>
