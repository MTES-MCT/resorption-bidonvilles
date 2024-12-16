<template>
    <div class="flex justify-between">
        <section>
            <article>
                <p>Filtrer par</p>
                <div
                    class="grid grid-cols-3 gap-2 lg:flex lg:space-x-4 items-center"
                >
                    <div
                        class="border-b border-b-transparent hover:border-b-primary"
                        v-for="filter in filters"
                        :key="filter.id"
                    >
                        <Checkbox
                            :label="filter.label"
                            variant="toggle"
                            v-model="questionsStore.filters.tags[filter.id]"
                        />
                    </div>
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
                class="border-1 !border-primary rounded hover:bg-blue200"
            />
        </section>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useConfigStore } from "@/stores/config.store";
import { useQuestionsStore } from "@/stores/questions.store";
import sort from "./ListeDesQuestions.sort";

import { CheckboxUi as Checkbox, Sort } from "@resorptionbidonvilles/ui";

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
