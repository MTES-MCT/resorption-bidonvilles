<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <EntraideBanniere class="mb-8" />
    <EntraideHeader />

    <Loading v-if="questionsStore.isLoading !== false" />
    <EntraideErreur v-else-if="questionsStore.error" />

    <template v-else>
        <ListeDesQuestionsFiltres class="-mt-5 mb-4" />
        <ListeDesQuestionsRecherche class="mb-4" />
        <ListeDesQuestions v-if="questionsStore.filteredQuestions.length > 0" />
        <ListeDesQuestionsVide v-else />
    </template>
</template>

<script setup>
import { useQuestionsStore } from "@/stores/questions.store";

import Loading from "@/components/Loading/Loading.vue";
import EntraideBanniere from "./EntraideBanniere.vue";
import EntraideHeader from "./EntraideHeader.vue";
import ListeDesQuestionsFiltres from "./ListeDesQuestionsFiltres.vue";
import ListeDesQuestionsRecherche from "./ListeDesQuestionsRecherche.vue";
import ListeDesQuestions from "./ListeDesQuestions.vue";
import ListeDesQuestionsVide from "./ListeDesQuestionsVide.vue";
import EntraideErreur from "./EntraideErreur.vue";

const questionsStore = useQuestionsStore();
</script>
