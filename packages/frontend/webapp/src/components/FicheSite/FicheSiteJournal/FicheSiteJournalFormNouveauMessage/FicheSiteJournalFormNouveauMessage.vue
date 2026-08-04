<template>
    <form>
        <h3 class="font-bold text-lg">Partager une info</h3>

        <DragZone class="bg-white py-6 px-2" @drop="attachmentsInput?.addFiles">
            <div ref="interactionRoot">
                <div class="px-4">
                    <FormNouveauMessageInputMessage
                        :rows="rows"
                        ref="messageInput"
                        @paste="onPaste"
                    />
                </div>
                <div
                    class="transition-height h-0 overflow-y-hidden px-4"
                    ref="formContainer"
                >
                    <FormNouveauMessageInputAttachments
                        ref="attachmentsInput"
                    />
                    <FormNouveauMessageInputTags />
                    <FormNouveauMessageInputMode @click="onModeChange" />
                    <FormNouveauMessageInputTarget
                        v-show="values.mode === 'custom'"
                        :departement="town.departement.code"
                    />
                    <p class="text-sm mb-4">
                        (*) Quelle que soit l'option retenue, les
                        administrateurs locaux et nationaux auront accès au
                        message à des fins de modération
                    </p>
                    <ErrorSummary v-if="error" :message="error" class="mt-2" />
                    <p class="text-right space-x-2">
                        <DsfrButton
                            icon="fr-icon-arrow-go-back-fill"
                            :disabled="isLoading"
                            secondary
                            @click="closeForm"
                            >Annuler</DsfrButton
                        >
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
import { toRefs, ref } from "vue";
import { useForm } from "vee-validate";
import { useTownsStore } from "@/stores/towns.store";
import schema from "./FicheSiteJournalFormNouveauMessage.schema";
import router from "@/helpers/router";
import getFileFromPasteEvent from "@/utils/getFileFromPasteEvent";
import useJournalMessageFormDropdown from "@/composables/useJournalMessageFormDropdown";

import { ErrorSummary } from "@resorptionbidonvilles/ui";
import DragZone from "@/components/DragZone/DragZone.vue";
import FormNouveauMessageInputMessage from "./inputs/FormNouveauMessageInputMessage.vue";
import FormNouveauMessageInputTags from "./inputs/FormNouveauMessageInputTags.vue";
import FormNouveauMessageInputMode from "./inputs/FormNouveauMessageInputMode.vue";
import FormNouveauMessageInputTarget from "./inputs/FormNouveauMessageInputTarget.vue";
import FormNouveauMessageInputAttachments from "./inputs/FormNouveauMessageInputAttachments.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);

const initialValues = {
    comment: "",
    tags: [],
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

const isLoading = ref(false);
const error = ref(null);
const interactionRoot = ref(null);
const formContainer = ref(null);
const messageInput = ref(null);
const attachmentsInput = ref(null);
const { rows, isFocused, closeForm, setAutoHeight } =
    useJournalMessageFormDropdown({
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

const submit = handleSubmit(async (values) => {
    error.value = null;
    isLoading.value = true;
    try {
        const townsStore = useTownsStore();
        await townsStore.addComment(
            town.value.id,
            {
                comment: values.comment,
                targets: {
                    mode: values.mode,
                    ...values.target,
                },
                tags: values.tags,
            },
            values.attachments
        );
        resetForm();
        isLoading.value = false;

        // on rafraîchit la page pour avoir le site mis à jour
        router.push(`/site/${town.value.id}/#journal_du_site`);
    } catch (e) {
        isLoading.value = false;
        error.value = e?.user_message || "Une erreur inconnue est survenue";
        if (e?.fields) {
            setErrors(e.fields);
        }
    }
});

defineExpose({
    isFocused,
    focus: (...args) => messageInput.value.focus(...args),
});
</script>

<style scoped>
button {
    border: inherit;
}
</style>
