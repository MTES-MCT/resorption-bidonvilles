<template>
    <LayoutCommunaute :paddingTop="false">
        <ContentWrapper>
            <FilArianne :items="ariane" class="my-8" />
            <Entraide />
        </ContentWrapper>
    </LayoutCommunaute>
</template>

<script setup>
import { onMounted } from "vue";
import { useQuestionsStore } from "@/stores/questions.store";
import { useDirectoryStore } from "@/stores/directory.store";

import { ContentWrapper, FilArianne } from "@resorptionbidonvilles/ui";
import LayoutCommunaute from "@/components/LayoutCommunaute/LayoutCommunaute.vue";
import Entraide from "@/components/Entraide/Entraide.vue";

const questionsStore = useQuestionsStore();
const ariane = [{ label: "Accueil", to: "/" }, { label: "Entraide" }];

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
