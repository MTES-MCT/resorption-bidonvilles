<template>
    <FilePreviewList
        :files="attachments"
        :allowDeletion="isOwnerOfQuestion || canModerate"
        @deleteFile="onDeleteAttachment"
    />
</template>

<script setup>
import { computed, toRefs } from "vue";
import { FilePreviewList } from "@resorptionbidonvilles/ui";
import { useAttachmentsStore } from "@/stores/attachments.store";
import { useUserStore } from "@/stores/user.store";

const props = defineProps({
    questionId: Number,
    attachments: Array,
});
const { attachments, questionId } = toRefs(props);
const isOwnerOfQuestion = false;

const canModerate = computed(() => {
    const userStore = useUserStore();
    return userStore.hasPermission("data.moderate");
});

function onDeleteAttachment(file) {
    const attachmentStore = useAttachmentsStore();
    attachmentStore.deleteQuestionAttachment(file, {
        questionId: questionId.value,
    });
}
</script>
