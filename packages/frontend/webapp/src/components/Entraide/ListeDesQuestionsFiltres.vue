<template>
    <section class="flex items-end flex-wrap space-x-4">
        <article>
            <p>Filtrer par</p>
            <Filter
                :key="filter.id"
                :title="filter.label"
                :options="filter.options"
                v-model="questionsStore.filters[filter.id]"
            />
        </article>
    </section>
</template>

<script setup>
import { computed } from "vue";
import { useConfigStore } from "@/stores/config.store";
import { useQuestionsStore } from "@/stores/questions.store";

import { Filter } from "@resorptionbidonvilles/ui";

const configStore = useConfigStore();
const questionsStore = useQuestionsStore();

const filter = computed(() => {
    return {
        label: "Thématique",
        id: "tags",
        options: [
            ...configStore.config.question_tags.map(({ uid, name }) => ({
                value: uid,
                label: name,
            })),
            { value: "other", label: "Autre" },
        ],
    };
});
</script>
