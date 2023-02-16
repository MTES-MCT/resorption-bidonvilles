<template>
    <LayoutCommunaute>
        <ListeDesQuestions />
    </LayoutCommunaute>
</template>

<script setup>
import { onMounted } from "vue";
import { useQuestionsStore } from "@/stores/questions.store";

import LayoutCommunaute from "@/components/LayoutCommunaute/LayoutCommunaute.vue";
import ListeDesQuestions from "@/components/ListeDesQuestions/ListeDesQuestions.vue";

const questionsStore = useQuestionsStore();

onMounted(() => {
    if (questionsStore.questions.length === 0) {
        load();
    }
});

function load() {
    questionsStore.fetchQuestions();
    questionsStore.currentPage.index = 1;
}
</script>
