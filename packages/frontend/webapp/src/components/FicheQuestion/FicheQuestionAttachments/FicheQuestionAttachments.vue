<template>
    <FilePreviewList
        :files="attachments"
        collapsedByDefault
        @delete="handleDeleteAttachment"
        :disallowAttachmentsRemoval="disallowAttachmentsRemoval"
    />
</template>

<script setup>
import { toRefs } from "vue";
import { FilePreviewList } from "@resorptionbidonvilles/ui";
import { useQuestionsStore } from "@/stores/questions.store";

const props = defineProps({
    entityId: Number,
    attachments: Array,
    disallowAttachmentsRemoval: Boolean,
});
const { entityId, attachments, disallowAttachmentsRemoval } = toRefs(props);
const questionsStore = useQuestionsStore();

async function handleDeleteAttachment(file) {
    await questionsStore.deleteQuestionAttachment(entityId.value, file.id);
}
</script>
