<template>
    <div class="m-auto pb-2 print:hidden">
        <label> Rechercher une question par mot-clé </label>
        <div class="flex items-center space-x-2">
            <InputEntraideSearch
                class="flex-1"
                placeholder="mot-clé"
                withoutMargin
                :allowFreeSearch="true"
                v-model="inputSearch"
            />
        </div>
    </div>
</template>
<script setup>
import { computed } from "vue";
import { useQuestionsStore } from "@/stores/questions.store";
import router from "@/helpers/router";

import InputEntraideSearch from "@/components/InputEntraideSearch/InputEntraideSearch.vue";

const questionsStore = useQuestionsStore();

const inputSearch = computed({
    get() {
        return {
            search: questionsStore.search.value,
        };
    },
    set(newValue) {
        if (newValue?.data) {
            router.push(`/question/${newValue.data.id}`);
        }
    },
});
</script>
