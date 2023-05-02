<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <ContentWrapper>
        <EntraideBanniere class="mb-8" />
        <EntraideHeader />

        <Loading v-if="questionsStore.isLoading !== false" />
        <EntraideErreur v-else-if="questionsStore.error" />

        <template v-else>
            <ListeDesQuestionsFiltres class="-mt-5 mb-4" />
            <ListeDesQuestions
                v-if="questionsStore.filteredQuestions.length > 0"
            />
            <ListeDesQuestionsVide v-else />
        </template>
    </ContentWrapper>
</template>

<script setup>
import { useQuestionsStore } from "@/stores/questions.store";

import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import Loading from "@/components/Loading/Loading.vue";
import EntraideBanniere from "./EntraideBanniere.vue";
import EntraideHeader from "./EntraideHeader.vue";
import ListeDesQuestionsFiltres from "./ListeDesQuestionsFiltres.vue";
import ListeDesQuestions from "./ListeDesQuestions.vue";
import ListeDesQuestionsVide from "./ListeDesQuestionsVide.vue";
import EntraideErreur from "./EntraideErreur.vue";

const questionsStore = useQuestionsStore();
</script>
