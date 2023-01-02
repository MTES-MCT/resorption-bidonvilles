<template>
    <form>
        <FormParagraph :title="labels.question">
            <FormNouvelleQuestionInputQuestion :question="question" />
        </FormParagraph>
        <FormParagraph :title="labels.tags">
            <FormNouvelleQuestionInputTags
        /></FormParagraph>
        <FormParagraph :title="labels.other_tag" v-if="showOtherTag">
            <FormNouvelleQuestionInputOtherTag />
        </FormParagraph>
        <FormParagraph :title="labels.people_affected">
            <FormNouvelleQuestionInputPeopleAffected />
        </FormParagraph>
        <FormParagraph :title="labels.details">
            <FormNouvelleQuestionInputDetails />
        </FormParagraph>

        <ErrorSummary
            id="erreurs"
            class="mt-12"
            v-if="error || Object.keys(errors).length > 0"
            :message="error"
            :summary="errors"
        />
    </form>
</template>

<script setup>
import { ref, defineExpose, computed, toRefs } from "vue";
import { useForm, useFieldValue } from "vee-validate";
import schema from "./FormNouvelleQuestion.schema";
import labels from "./FormNouvelleQuestion.labels";
import { useNotificationStore } from "@/stores/notification.store";
import { createQuestion } from "@/api/questions.api";
import router from "@/helpers/router";

import { ErrorSummary } from "@resorptionbidonvilles/ui";
import FormParagraph from "@/components/FormParagraph/FormParagraph.vue";
import FormNouvelleQuestionInputQuestion from "./inputs/FormNouvelleQuestionInputQuestion.vue";
import FormNouvelleQuestionInputPeopleAffected from "./inputs/FormNouvelleQuestionInputPeopleAffected.vue";
import FormNouvelleQuestionInputDetails from "./inputs/FormNouvelleQuestionInputDetails.vue";
import FormNouvelleQuestionInputTags from "./inputs/FormNouvelleQuestionInputTags.vue";
import FormNouvelleQuestionInputOtherTag from "./inputs/FormNouvelleQuestionInputOtherTag.vue";

const { handleSubmit, setErrors, errors } = useForm({
    validationSchema: schema,
    initialValues: {},
});

const props = defineProps({
    question: {
        type: String,
        required: false,
        default: "",
    },
});

const { question } = toRefs(props);
const tags = useFieldValue("tags");

const showOtherTag = computed(() => {
    return tags.value && tags.value.includes("other");
});

const error = ref(null);

async function submit(values) {
    const question = await createQuestion(values);
    return question;
}

defineExpose({
    submit: handleSubmit(async (sentValues) => {
        error.value = null;

        try {
            const notificationStore = useNotificationStore();
            const question = await submit(sentValues);
            notificationStore.success(
                "Question publiée",
                "Votre question a été publiée, vous la retrouverez dans l'onglet communauté"
            );
            router.push(`/question/${question.id}`);
        } catch (e) {
            error.value = e?.user_message || "Une erreur inconnue est survenue";
            if (e?.fields) {
                setErrors(e.fields);
            }
        }
    }),
});
</script>
