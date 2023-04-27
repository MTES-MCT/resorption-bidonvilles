<template>
    <section class="flex flex-col space-y-4">
        <ListeDesQuestionsFiltres class="mt-4" />
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
</template>

<script setup>
import { useQuestionsStore } from "@/stores/questions.store";

import CarteQuestion from "@/components/CarteQuestion/CarteQuestion.vue";
import ListeDesQuestionsFiltres from "./ListeDesQuestionsFiltres.vue";
import { BottomPagination } from "@resorptionbidonvilles/ui";

const questionsStore = useQuestionsStore();

function changePage(page) {
    questionsStore.currentPage.index = page;
}
</script>
