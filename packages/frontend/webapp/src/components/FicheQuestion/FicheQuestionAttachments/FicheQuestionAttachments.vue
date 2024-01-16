<template>
    <FilePreviewList
        :files="attachments"
        collapsedByDefault
        @delete="handleDeleteAttachment"
    />
</template>

<script setup>
import { toRefs } from "vue";
import { FilePreviewList } from "@resorptionbidonvilles/ui";
import { useQuestionsStore } from "@/stores/questions.store";

const props = defineProps({
    entityId: Number,
    attachments: Array,
});
const { entityId, attachments } = toRefs(props);
const questionsStore = useQuestionsStore();

async function handleDeleteAttachment(file) {
    // emit("deleteAttachment", file, index);
    console.log(
        "handleDeleteAttachment" +
            "\n entity_type: " +
            "question" +
            "\n entityId: " +
            entityId.value +
            "\n attachmentId: " +
            file.id +
            "\n" +
            " from FicheQuestionAttachments.vue"
    );
    console.log(
        "Appel de questionStore.deleteAttachment from FicheQuestionAttachments.vue"
    );
    await questionsStore.deleteQuestionAttachment(entityId.value, file.id);
}
</script>
