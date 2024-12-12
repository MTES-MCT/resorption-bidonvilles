<template>
    <form>
        <DragZone @drop="attachmentsInput?.addFiles">
            <IndicationCaractereObligatoire />

            <FormParagraph :title="labels.question" showMandatoryStar>
                <FormNouvelleQuestionInputQuestion
                    :disabled="mode === 'edit'"
                    :question="resume"
                />
            </FormParagraph>
            <FormParagraph :title="labels.tags" info="(optionnel)">
                <FormNouvelleQuestionInputTags :disabled="mode === 'edit'"
            /></FormParagraph>
            <FormParagraph :title="labels.other_tag" v-if="showOtherTag">
                <FormNouvelleQuestionInputOtherTag
                    :tag="otherTag"
                    :disabled="mode === 'edit'"
                />
            </FormParagraph>
            <FormParagraph :title="labels.people_affected" info="(optionnel)">
                <FormNouvelleQuestionInputPeopleAffected
                    :peopleAffected="peopleAffected"
                />
            </FormParagraph>
            <FormParagraph :title="labels.details" showMandatoryStar>
                <FormNouvelleQuestionInputDetails @paste="onPaste" />
            </FormParagraph>
            <FormParagraph :title="labels.attachments" v-show="mode !== 'edit'">
                <FormNouvelleQuestionInputAttachments ref="attachmentsInput" />
            </FormParagraph>
        </DragZone>

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
import getFileFromPasteEvent from "@/utils/getFileFromPasteEvent";
import { trackEvent } from "@/helpers/matomo";
// import formatFormDate from "@common/utils/formatFormDate";
import backOrReplace from "@/utils/backOrReplace";
import isDeepEqual from "@/utils/isDeepEqual";

import { ErrorSummary, FormParagraph } from "@resorptionbidonvilles/ui";
import DragZone from "@/components/DragZone/DragZone.vue";
import IndicationCaractereObligatoire from "@/components/IndicationCaractereObligatoire/IndicationCaractereObligatoire.vue";
import FormNouvelleQuestionInputQuestion from "./inputs/FormNouvelleQuestionInputQuestion.vue";
import FormNouvelleQuestionInputPeopleAffected from "./inputs/FormNouvelleQuestionInputPeopleAffected.vue";
import FormNouvelleQuestionInputDetails from "./inputs/FormNouvelleQuestionInputDetails.vue";
import FormNouvelleQuestionInputTags from "./inputs/FormNouvelleQuestionInputTags.vue";
import FormNouvelleQuestionInputOtherTag from "./inputs/FormNouvelleQuestionInputOtherTag.vue";
import FormNouvelleQuestionInputAttachments from "./inputs/FormNouvelleQuestionInputAttachments.vue";
import schemaFn from "./FormNouvelleQuestion.schema";

const props = defineProps({
    question: {
        type: Object,
        required: false,
        default: null,
    },
    resume: {
        type: String,
        required: false,
        default: "",
    },
});

const { question, resume } = toRefs(props);
const mode = computed(() => {
    return question.value === null ? "create" : "edit";
});
const validationSchema = schemaFn;
const questionsStore = useQuestionsStore();

const { handleSubmit, setErrors, errors, isSubmitting, values } = useForm({
    validationSchema: schema,
    initialValues: {
        details: question.value?.details || "",
        question: question.value?.question || resume.value || "",
        tags: question.value?.tags.map(({ uid }) => uid) || [],
        other_tags: question.value?.other_tags || "",
        people_affected: question.value?.people_affected || "",
        attachments: new DataTransfer().files,
    },
});
const originalValues = formatValuesForApi(values);
const tags = useFieldValue("tags");
const attachmentsInput = ref(null);

const showOtherTag = computed(() => {
    return tags.value && tags.value.includes("other");
});

function onPaste(event) {
    const file = getFileFromPasteEvent(event);
    if (file) {
        attachmentsInput.value.addFiles([file]);
    }
}

const error = ref(null);

function formatValuesForApi(v) {
    return {
        ...Object.keys(validationSchema.fields).reduce((acc, key) => {
            acc[key] = v[key] ? JSON.parse(JSON.stringify(v[key])) : v[key];
            return acc;
        }, {}),
    };
}

const config = {
    create: {
        async submit(values, attachments) {
            const addedQuestion = await questionsStore.create(
                values,
                attachments
            );
            trackEvent("Action", "Création question", `${addedQuestion.id}`);
            return addedQuestion;
        },
        notification: {
            title: "Question publiée",
            content:
                "Votre question a été publiée, vous la retrouverez dans l'onglet Entraide",
        },
    },
    edit: {
        async submit(values, id) {
            const updatedQuestion = await questionsStore.edit(id, values);
            trackEvent("Action", "Mise à jour de la question", `${id}`);
            return updatedQuestion;
        },
        notification: {
            title: "Question modifiée",
            content: "Votre question a bien été modifiée.",
        },
    },
};

const otherTag = computed(() => {
    const otherTag = question.value?.tags.find((tag) => tag.uid === "other");
    const otherTagName = otherTag ? otherTag.name : "";
    return otherTagName;
});

const peopleAffected = computed(() => {
    return question.value?.peopleAffected;
});

defineExpose({
    submit: handleSubmit(async (sentValues) => {
        const formattedValues = formatValuesForApi(sentValues);

        if (
            mode.value === "edit" &&
            isDeepEqual(originalValues, formattedValues)
        ) {
            router.replace("#erreurs");
            error.value =
                "Modification impossible : aucun champ n'a été modifié";
            return;
        }

        error.value = null;

        try {
            const { attachments, ...valuesWithoutAttachments } = sentValues;
            const { submit, notification } = config[mode.value];
            let addressedQuestion = null;

            // On test si on est en mode création ou modification
            if (mode.value === "create") {
                // On envoie les valeurs du formulaire à la méthode submit de la store
                addressedQuestion = await submit(
                    valuesWithoutAttachments,
                    attachments
                );
            } else {
                // On supprime les attachments
                valuesWithoutAttachments.attachments = {};
                // On envoie les valeurs du formulaire à la méthode submit du store
                addressedQuestion = await submit(
                    valuesWithoutAttachments,
                    question.value?.id,
                    question.value?.createdBy.id
                );
            }

            const notificationStore = useNotificationStore();
            notificationStore.success(notification.title, notification.content);
            backOrReplace(`/question/${addressedQuestion.id}`);
        } catch (e) {
            error.value = e?.user_message || "Une erreur inconnue est survenue";
            if (e?.fields) {
                setErrors(e.fields);
            }
        }
    }),
    isSubmitting,
});
</script>
