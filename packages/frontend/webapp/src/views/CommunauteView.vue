<template>
    <LayoutCommunauteSearch
        allowFreeSearch
        searchTitle=" Rechercher un contact, un acteur, une structure..."
        searchPlaceholder="Nom d'un territoire, d'une structure, d'un acteur..."
        showNationalWording="Voir tous les acteurs en France"
    >
        <ListeDesQuestions v-if="questionsStore.tab === 'communaute'" />
        <Annuaire
            v-if="questionsStore.tab === 'directory'"
            v-model:search="search"
        />
    </LayoutCommunauteSearch>
</template>

<script setup>
import { onMounted } from "vue";
import { useQuestionsStore } from "@/stores/questions.store";
import { useDirectoryStore } from "@/stores/directory.store";

import LayoutCommunauteSearch from "@/components/LayoutCommunauteSearch/LayoutCommunauteSearch.vue";
import ListeDesQuestions from "@/components/ListeDesQuestions/ListeDesQuestions.vue";
import Annuaire from "@/components/Annuaire/Annuaire.vue";

const questionsStore = useQuestionsStore();
const directoryStore = useDirectoryStore();

onMounted(() => {
    if (questionsStore.questions.length === 0 || !directoryStore.isLoaded) {
        load();
    }
});

function load() {
    questionsStore.fetchQuestions();
    directoryStore.fetchDirectory();
    questionsStore.currentPage.index = 1;
    questionsStore.tab = "communaute";
}
</script>
