<template>
    <form>
        <h1 class="font-bold text-lg">Partager une info</h1>

        <DragZone class="bg-white p-6" @drop="handleFileDrop">
            <FormNouveauMessageInputMessage />
            <FormNouveauMessageInputAttachments ref="attachmentsInput" />

            <ErrorSummary v-if="error" :message="error" class="mt-2" />
            <p class="text-right">
                <Button icon="paper-plane" iconPosition="left" @click="submit"
                    >Publier le message</Button
                >
            </p>
        </DragZone>
    </form>
</template>

<script setup>
import { defineProps, toRefs, ref } from "vue";
import { useForm } from "vee-validate";
import { useActionsStore } from "@/stores/actions.store";
import schema from "./FicheActionJournalFormNouveauMessage.schema";

import { Button, ErrorSummary } from "@resorptionbidonvilles/ui";
import DragZone from "@/components/DragZone/DragZone.vue";
import FormNouveauMessageInputMessage from "./inputs/FormNouveauMessageInputMessage.vue";
import FormNouveauMessageInputAttachments from "./inputs/FormNouveauMessageInputAttachments.vue";

const props = defineProps({
    action: Object,
});
const { action } = toRefs(props);
const attachmentsInput = ref(null);

const { handleSubmit, setErrors, resetForm } = useForm({
    validationSchema: schema,
});

function handleFileDrop(files) {
    attachmentsInput.value.addFiles(files);
}

const error = ref(null);
const submit = handleSubmit(async (values) => {
    error.value = null;

    try {
        const actionsStore = useActionsStore();
        await actionsStore.addComment(
            action.value.id,
            { description: values.comment },
            values.attachments
        );

        resetForm();
    } catch (e) {
        error.value = e?.user_message || "Une erreur inconnue est survenue";
        if (e?.fields) {
            setErrors(e.fields);
        }
    }
});
</script>
