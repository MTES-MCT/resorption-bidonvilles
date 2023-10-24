<template>
    <form>
        <FormParagraph :title="labels.question" showMandatoryStar>
            <FormNouvelleQuestionInputQuestion :question="question" />
        </FormParagraph>
        <FormParagraph :title="labels.tags" info="(optionnel)">
            <FormNouvelleQuestionInputTags
        /></FormParagraph>
        <FormParagraph :title="labels.other_tag" v-if="showOtherTag">
            <FormNouvelleQuestionInputOtherTag />
        </FormParagraph>
        <FormParagraph :title="labels.people_affected" info="(optionnel)">
            <FormNouvelleQuestionInputPeopleAffected />
        </FormParagraph>
        <FormParagraph :title="labels.details" showMandatoryStar>
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
import { useQuestionsStore } from "@/stores/questions.store";
import router from "@/helpers/router";

import { ErrorSummary, FormParagraph } from "@resorptionbidonvilles/ui";
import FormNouvelleQuestionInputQuestion from "./inputs/FormNouvelleQuestionInputQuestion.vue";
import FormNouvelleQuestionInputPeopleAffected from "./inputs/FormNouvelleQuestionInputPeopleAffected.vue";
import FormNouvelleQuestionInputDetails from "./inputs/FormNouvelleQuestionInputDetails.vue";
import FormNouvelleQuestionInputTags from "./inputs/FormNouvelleQuestionInputTags.vue";
import FormNouvelleQuestionInputOtherTag from "./inputs/FormNouvelleQuestionInputOtherTag.vue";

const { handleSubmit, setErrors, errors } = useForm({
    validationSchema: schema,
    initialValues: {
        question: router.currentRoute.value.query?.resume || "",
        tags: [],
    },
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

defineExpose({
    submit: handleSubmit(async (sentValues) => {
        error.value = null;

        try {
            const questionsStore = useQuestionsStore();
            const question = await questionsStore.create(sentValues);
            const notificationStore = useNotificationStore();
            notificationStore.success(
                "Question publiée",
                "Votre question a été publiée, vous la retrouverez dans l'onglet entraide"
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
