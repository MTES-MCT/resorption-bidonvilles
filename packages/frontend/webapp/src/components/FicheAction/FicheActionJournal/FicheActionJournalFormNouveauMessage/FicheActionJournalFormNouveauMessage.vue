<template>
    <form>
        <h1 class="font-bold text-lg">Partager une info</h1>

        <DragZone class="bg-white p-6" @drop="attachmentsInput?.addFiles">
            <div ref="interactionRoot">
                <FormNouveauMessageInputMessage
                    :rows="rows"
                    ref="messageInput"
                    @paste="onPaste"
                />
                <div
                    class="transition-height h-0 overflow-y-hidden"
                    ref="formContainer"
                >
                    <FormNouveauMessageInputAttachments
                        ref="attachmentsInput"
                    />
                    <FormNouveauMessageInputMode @click="onModeChange" />
                    <FormNouveauMessageInputTarget
                        v-show="values.mode === 'custom'"
                        :departement="action?.location?.departement?.code"
                    />
                    <p class="text-sm mb-4">
                        (*) Quelle que soit l'option retenue, les
                        administrateurs locaux et nationaux auront accès au
                        message à des fins de modération
                    </p>

                    <ErrorSummary v-if="error" :message="error" class="mt-2" />
                    <p class="text-right">
                        <DsfrButton
                            :disabled="isLoading"
                            :icon="
                                isLoading
                                    ? {
                                          name: 'fa-solid:spinner',
                                          animation: 'spin',
                                      }
                                    : 'fr-icon-send-plane-fill'
                            "
                            @click="submit"
                            >Publier le message</DsfrButton
                        >
                    </p>
                </div>
            </div>
        </DragZone>
    </form>
</template>

<style scoped>
.transition-height {
    transition-property: height;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
}
</style>

<script setup>
import { ref, toRefs } from "vue";
import { useForm } from "vee-validate";
import { useActionsStore } from "@/stores/actions.store";
import schema from "./FicheActionJournalFormNouveauMessage.schema";
import getFileFromPasteEvent from "@/utils/getFileFromPasteEvent";
import useJournalMessageFormDropdown from "@/composables/useJournalMessageFormDropdown";

import { ErrorSummary } from "@resorptionbidonvilles/ui";
import DragZone from "@/components/DragZone/DragZone.vue";
import FormNouveauMessageInputMessage from "./inputs/FormNouveauMessageInputMessage.vue";
import FormNouveauMessageInputAttachments from "./inputs/FormNouveauMessageInputAttachments.vue";
import FormNouveauMessageInputMode from "./inputs/FormNouveauMessageInputMode.vue";
import FormNouveauMessageInputTarget from "./inputs/FormNouveauMessageInputTarget.vue";

const props = defineProps({
    action: Object,
});
const { action } = toRefs(props);
const interactionRoot = ref(null);
const formContainer = ref(null);
const attachmentsInput = ref(null);
const messageInput = ref(null);
const isLoading = ref(false);

const initialValues = {
    comment: "",
    mode: "public",
    target: {
        organizations: [],
        users: [],
    },
    attachments: new DataTransfer().files,
};

const { handleSubmit, setErrors, resetForm, values } = useForm({
    validationSchema: schema,
    initialValues,
});

const { rows, setAutoHeight } = useJournalMessageFormDropdown({
    values,
    initialValues,
    resetForm,
    messageInput,
    attachmentsInput,
    formContainer,
    interactionRoot,
});

function onModeChange() {
    setAutoHeight();
}

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
            {
                description: values.comment,
                targets: {
                    mode: values.mode,
                    ...values.target,
                },
            },
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
