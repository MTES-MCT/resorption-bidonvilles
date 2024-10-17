<template>
    <form>
        <DragZone @drop="attachmentsInput?.addFiles">
            <FicheQuestionNouvelleReponseInputReponse @paste="onPaste" />
            <FicheQuestionNouvelleReponseInputAttachments
                ref="attachmentsInput"
            />
        </DragZone>

        <ErrorSummary v-if="error" :message="error" class="mt-2" />
        <p class="text-right">
            <Button
                :loading="isLoading"
                icon="paper-plane"
                iconPosition="left"
                @click="submit"
                >Publier ma réponse</Button
            >
        </p>
    </form>
</template>

<script setup>
import { defineProps, toRefs, ref } from "vue";
import { useForm } from "vee-validate";
import schema from "./FicheQuestionNouvelleReponse.schema";
import { useQuestionsStore } from "@/stores/questions.store";
import getFileFromPasteEvent from "@/utils/getFileFromPasteEvent";

import { Button, ErrorSummary } from "@resorptionbidonvilles/ui";
import FicheQuestionNouvelleReponseInputReponse from "./inputs/FicheQuestionNouvelleReponseInputReponse.vue";
import FicheQuestionNouvelleReponseInputAttachments from "./inputs/FicheQuestionNouvelleReponseInputAttachments.vue";
import DragZone from "@/components/DragZone/DragZone.vue";

const props = defineProps({
    question: Object,
});
const { question } = toRefs(props);
const attachmentsInput = ref(null);
const isLoading = ref(false);

function onPaste(event) {
    const file = getFileFromPasteEvent(event);
    if (file) {
        attachmentsInput.value.addFiles([file]);
    }
}

const { handleSubmit, setErrors, resetForm } = useForm({
    validationSchema: schema,
    initialValues: {
        answer: "",
        attachments: new DataTransfer().files,
    },
});

const error = ref(null);
const submit = handleSubmit(async (values) => {
    error.value = null;
    isLoading.value = true;
    try {
        const questionsStore = useQuestionsStore();
        await questionsStore.createAnswer(
            question.value.id,
            {
                description: values.answer,
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
