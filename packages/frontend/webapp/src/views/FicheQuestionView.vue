<template>
    <LayoutCommunaute :paddingBottom="question === null">
        <Loading v-if="isLoading !== false" />

        <ViewError v-else-if="error !== null || question === null">
            <template v-slot:title>Fiche question inaccessible</template>
            <template v-slot:code>{{ error }}</template>
            <template v-slot:content
                >Vous souhaitiez consulter la fiche détaillée d'une question,
                mais nous ne parvenons pas à collecter les informations
                nécessaires. Vous pouvez réessayer un peu plus tard ou nous
                contacter en cas d'urgence.</template
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
        </ViewError>

        <template v-else>
            <ContentWrapper>
                <FilArianne :items="ariane" class="mb-8" />
            </ContentWrapper>
            <FicheQuestion :question="question" />
        </template>
    </LayoutCommunaute>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { useQuestionsStore } from "@/stores/questions.store.js";
import router, { setDocumentTitle } from "@/helpers/router";

import { Button, ContentWrapper, FilArianne } from "@resorptionbidonvilles/ui";
import ViewError from "@/components/ViewError/ViewError.vue";
import Loading from "@/components/Loading/Loading.vue";
import LayoutCommunaute from "@/components/LayoutCommunaute/LayoutCommunaute.vue";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";
import FicheQuestion from "@/components/FicheQuestion/FicheQuestion.vue";

const questionsStore = useQuestionsStore();
const isLoading = ref(null);
const error = ref(null);
const question = ref(null);
const ariane = computed(() => [
    { label: "Accueil", to: "/" },
    { label: "Entraide", to: "/communaute" },
    { label: question.value.question || "..." },
]);

const questionId = computed(() => {
    return parseInt(router.currentRoute.value.params.id, 10);
});

onMounted(load);
watch(questionId, load);

async function load() {
    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    error.value = null;

    try {
        question.value = await questionsStore.fetchQuestion(questionId.value);
        setDocumentTitle(
            `${router.currentRoute.value.meta.title} — ${question.value.question}`
        );
    } catch (e) {
        error.value = e?.code || "Erreur inconnue";
    }

    isLoading.value = false;
}
</script>
