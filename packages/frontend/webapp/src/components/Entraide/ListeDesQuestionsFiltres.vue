<template>
    <section class="flex items-end flex-wrap space-x-4">
        <article>
            <p>Filtrer par</p>
            <div class="flex space-x-2">
                <Filter
                    :key="filter.id"
                    :title="filter.label"
                    :options="filter.options"
                    v-model="questionsStore.filters"
                />
            </div>
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
        id: "topic",
        options: configStore.config.topics.map(({ uid, name }) => ({
            value: uid,
            label: name,
        })),
    };
});
</script>
