<template>
    <ContentWrapper>
        <ListeDesQuestionsHeader />
        <Loading class="py-28" v-if="questionsStore.isLoading !== false" />
        <ViewError v-else-if="questionsStore.error">
            <template v-slot:title>Échec de la collecte des données</template>
            <template v-slot:code>{{ error }}</template>
            <template v-slot:content
                >Une erreur est survenue lors de la collecte des questions. Vous
                pouvez réessayer un peu plus tard ou nous contacter.</template
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
        <div v-else-if="questionsStore.questions.length > 0">
            <section class="flex flex-col space-y-4">
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
        </div>
        <ListeDesQuestionsVide class="mt-12" v-else />
    </ContentWrapper>
</template>

<script setup>
import { useQuestionsStore } from "@/stores/questions.store";
import CarteQuestion from "@/components/CarteQuestion/CarteQuestion.vue";

import { Button } from "@resorptionbidonvilles/ui";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import Loading from "@/components/Loading/Loading.vue";
import ListeDesQuestionsHeader from "./ListeDesQuestionsHeader.vue";
import ListeDesQuestionsVide from "./ListeDesQuestionsVide.vue";
import ViewError from "@/components/ViewError/ViewError.vue";
import { BottomPagination } from "@resorptionbidonvilles/ui";

const questionsStore = useQuestionsStore();

function changePage(page) {
    questionsStore.currentPage.index = page;
}
</script>
