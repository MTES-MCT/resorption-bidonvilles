<template>
    <section class="flex justify-between items-end">
        <section class="flex items-end space-x-8">
            <article>
                <p>Filtrer par</p>
                <div
                    class="flex flex-col flex-wrap sm:flex-row gap-2 items-start"
                >
                    <Filter
                        v-model="organizationTypesFilter"
                        title="Type de structure"
                        class="border-1 !border-primary rounded hover:bg-blue200"
                        :options="[
                            {
                                value: 'public_establishment',
                                label: `Service de l'état, établissement ou organisme public`,
                            },
                            {
                                value: 'administration',
                                label: `Administration`,
                            },
                            {
                                value: 'territorial_collectivity',
                                label: 'Collectivité territoriale',
                            },
                            { value: 'association', label: 'Association' },
                        ]"
                    />
                    <Filter
                        v-model="expertiseTopicsFilter"
                        v-if="expertiseTopicsItems.length > 0"
                        title="Expertises ou sujets d'intérêts"
                        :options="expertiseTopicsItems"
                        class="border-1 !border-primary rounded hover:bg-blue200"
                    />
                </div>
            </article>
        </section>
        <AnnuairePagination
            v-if="directoryStore.currentPage.content.length > 0"
        />
    </section>
</template>

<script setup>
import { computed } from "vue";
import { useDirectoryStore } from "@/stores/directory.store";
import { Filter } from "@resorptionbidonvilles/ui";
import AnnuairePagination from "./AnnuairePagination.vue";
import { useConfigStore } from "@/stores/config.store";

const configStore = useConfigStore();
const directoryStore = useDirectoryStore();

const organizationTypesFilter = computed({
    get() {
        return directoryStore.filters.organizationTypes;
    },
    set(newValue) {
        directoryStore.filters.organizationTypes = newValue;
    },
});

const expertiseTopicsFilter = computed({
    get() {
        return directoryStore.filters.expertiseTopics;
    },
    set(newValue) {
        directoryStore.filters.expertiseTopics = newValue;
    },
});

const expertiseTopicsItems = computed(() => {
    return (configStore.config?.expertise_topics || []).map((item) => ({
        value: item.uid,
        label: item.label,
    }));
});
</script>
