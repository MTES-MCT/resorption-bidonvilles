<template>
    <form>
        <DragZone @drop="attachmentsInput?.addFiles">
            <FicheQuestionNouvelleReponseInputReponse />
            <FicheQuestionNouvelleReponseInputAttachments
                ref="attachmentsInput"
            />
        </DragZone>

        <ErrorSummary v-if="error" :message="error" class="mt-2" />
        <p class="text-right">
            <Button icon="paper-plane" iconPosition="left" @click="submit"
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

import { Button, ErrorSummary } from "@resorptionbidonvilles/ui";
import FicheQuestionNouvelleReponseInputReponse from "./inputs/FicheQuestionNouvelleReponseInputReponse.vue";
import FicheQuestionNouvelleReponseInputAttachments from "./inputs/FicheQuestionNouvelleReponseInputAttachments.vue";
import DragZone from "@/components/DragZone/DragZone.vue";

const props = defineProps({
    question: Object,
});
const { question } = toRefs(props);
const attachmentsInput = ref(null);

const { handleSubmit, setErrors, resetForm } = useForm({
    validationSchema: schema,
});

const error = ref(null);
const submit = handleSubmit(async (values) => {
    error.value = null;

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
    } catch (e) {
        error.value = e?.user_message || "Une erreur inconnue est survenue";
        if (e?.fields) {
            setErrors(e.fields);
        }
    }
});
</script>
