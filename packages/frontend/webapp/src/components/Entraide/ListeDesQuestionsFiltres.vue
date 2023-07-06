<template>
    <div class="flex justify-between">
        <section>
            <article>
                <p>Filtrer par</p>
                <div class="flex space-x-2">
                    <Filter
                        v-for="filter in filters"
                        :key="filter.id"
                        :title="filter.label"
                        :options="filter.options"
                        v-model="questionsStore.filters.tags[filter.id]"
                    />
                </div>
            </article>
        </section>
        <section>
            <article>
                <p>Trier par</p>
            </article>
            <Sort
                v-model="questionsStore.sort"
                name="questions_list_sort"
                :options="sort"
            />
        </section>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useConfigStore } from "@/stores/config.store";
import { useQuestionsStore } from "@/stores/questions.store";
import sort from "./ListeDesQuestions.sort";

import { Filter, Sort } from "@resorptionbidonvilles/ui";

const configStore = useConfigStore();
const questionsStore = useQuestionsStore();

const filters = computed(() => {
    return [
        ...configStore.config.question_tags.map(({ uid, name }) => ({
            label: name,
            id: uid,
            options: [
                { value: "yes", label: "Oui" },
                { value: "no", label: "Non" },
            ],
        })),
        {
            label: "Autre",
            id: "other",
            options: [
                { value: "yes", label: "Oui" },
                { value: "no", label: "Non" },
            ],
        },
    ];
});
</script>
