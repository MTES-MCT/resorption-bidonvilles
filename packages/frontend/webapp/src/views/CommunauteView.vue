<template>
    <LayoutCommunaute :paddingTop="false">
        <Entraide />
    </LayoutCommunaute>
</template>

<script setup>
import { onMounted } from "vue";
import { useQuestionsStore } from "@/stores/questions.store";
import { useDirectoryStore } from "@/stores/directory.store";

import LayoutCommunaute from "@/components/LayoutCommunaute/LayoutCommunaute.vue";
import Entraide from "@/components/Entraide/Entraide.vue";

const questionsStore = useQuestionsStore();

onMounted(() => {
    if (questionsStore.questions.length === 0) {
        load();
    }
});

function load() {
    const directoryStore = useDirectoryStore();
    questionsStore.fetchQuestions();
    directoryStore.fetchDirectory(); // nécessaire pour afficher le nombre total d'utilisateurs
}
</script>
