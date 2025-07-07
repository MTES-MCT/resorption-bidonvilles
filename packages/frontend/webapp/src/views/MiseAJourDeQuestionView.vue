<template>
    <LayoutLoading v-if="isLoading !== false" />

    <LayoutError v-else-if="error !== null">
        <template v-slot:title>Formulaire inaccessible</template>
        <template v-slot:code>{{ error }}</template>
        <template v-slot:content
            >Vous souhaitiez modifier une question, mais nous ne parvenons pas à
            collecter les informations nécessaires. Vous pouvez réessayer un peu
            plus tard ou nous contacter en cas d'urgence.</template
        >
        <template v-slot:actions>
            <Button
                icon="rotate-right"
                iconPosition="left"
                type="button"
                @click="load"
                >Réessayer</Button
            >
            <ButtonContact />
        </template>
    </LayoutError>

    <LayoutForm v-else size="large">
        <template v-slot:title>Mise à jour de la question</template>
        <template v-slot:buttons>
            <Button
                variant="primaryOutline"
                type="button"
                @click="back"
                class="!border-2 !border-primary hover:!bg-primary"
                >Annuler</Button
            >
            <Button @click="submit" :loading="form?.isSubmitting"
                >Mettre à jour la question</Button
            >
        </template>

        <ContentWrapper size="large">
            <FormNouvelleQuestion ref="form" :question="question" />
        </ContentWrapper>
    </LayoutForm>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useQuestionsStore } from "@/stores/questions.store";
import router from "@/helpers/router";
import backOrReplace from "@/utils/backOrReplace";

import { Button, ContentWrapper } from "@resorptionbidonvilles/ui";
import LayoutError from "@/components/LayoutError/LayoutError.vue";
import LayoutLoading from "@/components/LayoutLoading/LayoutLoading.vue";
import LayoutForm from "@/components/LayoutForm/LayoutForm.vue";
import FormNouvelleQuestion from "@/components/FormNouvelleQuestion/FormNouvelleQuestion.vue";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";

const questionsStore = useQuestionsStore();
const isLoading = ref(null);
const error = ref(null);
const form = ref(null);
const question = ref(null);

onMounted(load);

const questionId = computed(() => {
    return parseInt(router.currentRoute.value.params.id, 10);
});

async function load() {
    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    error.value = null;
    try {
        question.value = await questionsStore.fetchQuestion(questionId.value);
    } catch (e) {
        error.value = e?.code || "Erreur inconnue";
    }

    isLoading.value = false;
}

function submit(...args) {
    return form.value.submit(...args);
}

function back() {
    if (questionId.value) {
        backOrReplace(`/question/${questionId.value}`);
    } else {
        router.back();
    }
}
</script>

<style scoped>
button {
    border: inherit;
}
</style>
