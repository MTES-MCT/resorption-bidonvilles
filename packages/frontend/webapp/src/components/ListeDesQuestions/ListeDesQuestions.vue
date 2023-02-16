<template>
    <ContentWrapper>
        <ListeDesQuestionsBanniere class="mb-8" />
        <ListeDesQuestionsHeader />

        <Loading v-if="questionsStore.isLoading !== false" />
        <ListeDesQuestionsErreur v-else-if="questionsStore.error" />

        <template v-else>
            <section
                v-if="questionsStore.questions.length > 0"
                class="flex flex-col space-y-4"
            >
                <CarteQuestion
                    v-for="question in questionsStore.currentPage.content"
                    :key="question.id"
                    :question="question"
                />
                <BottomPagination
                    :from="questionsStore.currentPage.from"
                    :to="questionsStore.currentPage.to"
                    :total="questionsStore.total"
                    :currentPage="questionsStore.currentPage.index"
                    :numberOfPages="questionsStore.numberOfPages"
                    @pagechange="changePage"
                />
            </section>

            <ListeDesQuestionsVide v-else />
        </template>
    </ContentWrapper>
</template>

<script setup>
import { useQuestionsStore } from "@/stores/questions.store";
import CarteQuestion from "@/components/CarteQuestion/CarteQuestion.vue";

import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import Loading from "@/components/Loading/Loading.vue";
import ListeDesQuestionsBanniere from "./ListeDesQuestionsBanniere.vue";
import ListeDesQuestionsHeader from "./ListeDesQuestionsHeader.vue";
import ListeDesQuestionsVide from "./ListeDesQuestionsVide.vue";
import ListeDesQuestionsErreur from "./ListeDesQuestionsErreur.vue";
import { BottomPagination } from "@resorptionbidonvilles/ui";

const questionsStore = useQuestionsStore();

function changePage(page) {
    questionsStore.currentPage.index = page;
}
</script>
