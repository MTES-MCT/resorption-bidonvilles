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

        <FicheQuestion v-else :question="question" />
    </LayoutCommunaute>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { useQuestionsStore } from "@/stores/questions.store.js";
import router from "@/helpers/router";

import { Button } from "@resorptionbidonvilles/ui";
import ViewError from "@/components/ViewError/ViewError.vue";
import Loading from "@/components/Loading/Loading.vue";
import LayoutCommunaute from "@/components/LayoutCommunaute/LayoutCommunaute.vue";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";
import FicheQuestion from "@/components/FicheQuestion/FicheQuestion.vue";

const questionsStore = useQuestionsStore();
const isLoading = ref(null);
const error = ref(null);
const question = ref(null);

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
    } catch (e) {
        error.value = e?.code || "Erreur inconnue";
    }

    isLoading.value = false;
}
</script>
