<template>
    <form>
        <h1 class="font-bold text-lg">Partager une info</h1>

        <DragZone class="bg-white p-6" @drop="attachmentsInput?.addFiles">
            <FormNouveauMessageInputMessage @paste="onPaste" />
            <FormNouveauMessageInputAttachments ref="attachmentsInput" />

            <ErrorSummary v-if="error" :message="error" class="mt-2" />
            <p class="text-right">
                <DsfrButton
                    :loading="isLoading"
                    icon="fr-icon-send-plane-fill"
                    @click="submit"
                    >Publier le message</DsfrButton
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
import getFileFromPasteEvent from "@/utils/getFileFromPasteEvent";

import { Button, ErrorSummary } from "@resorptionbidonvilles/ui";
import DragZone from "@/components/DragZone/DragZone.vue";
import FormNouveauMessageInputMessage from "./inputs/FormNouveauMessageInputMessage.vue";
import FormNouveauMessageInputAttachments from "./inputs/FormNouveauMessageInputAttachments.vue";

const props = defineProps({
    action: Object,
});
const { action } = toRefs(props);
const attachmentsInput = ref(null);
const isLoading = ref(false);

const { handleSubmit, setErrors, resetForm } = useForm({
    validationSchema: schema,
    initialValues: {
        comment: "",
        attachments: new DataTransfer().files,
    },
});

function onPaste(event) {
    const file = getFileFromPasteEvent(event);
    if (file) {
        attachmentsInput.value.addFiles([file]);
    }
}

const error = ref(null);
const submit = handleSubmit(async (values) => {
    error.value = null;

    try {
        isLoading.value = true;
        const actionsStore = useActionsStore();

        await actionsStore.addComment(
            action.value.id,
            { description: values.comment },
            values.attachments
        );

        resetForm();
        isLoading.value = false;
    } catch (e) {
        isLoading.value = false;
        error.value = e?.user_message || "Une erreur inconnue est survenue";
        if (e?.fields) {
            setErrors(e.fields);
        }
    }
});
</script>
