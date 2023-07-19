<template>
    <section>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <CarteQuestion
                v-for="question in questionsStore.currentPage.content"
                :key="question.id"
                :question="question"
            />
        </div>
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
import { BottomPagination } from "@resorptionbidonvilles/ui";

const questionsStore = useQuestionsStore();

function changePage(page) {
    questionsStore.currentPage.index = page;
}
</script>
