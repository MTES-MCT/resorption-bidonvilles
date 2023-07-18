<template>
    <section>
        <p>Filtrer les questions par mot-clé</p>
        <TextInput
            withoutMargin
            prefixIcon="search"
            v-model="searchFilter"
            @keyup="onKeyUp"
            variant="filter"
        />
    </section>
</template>

<script setup>
import { computed } from "vue";
import { useQuestionsStore } from "@/stores/questions.store";

import { TextInputUi as TextInput } from "@resorptionbidonvilles/ui";

const questionsStore = useQuestionsStore();

const searchFilter = computed({
    get() {
        return questionsStore.filters.search;
    },
    set(newValue) {
        questionsStore.filters.search = newValue;
    },
});

function onKeyUp(e) {
    questionsStore.filters.search = e.target.value;
}
</script>
