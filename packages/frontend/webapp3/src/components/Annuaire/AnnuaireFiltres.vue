<template>
    <section class="flex justify-between items-end">
        <section class="flex items-end space-x-8">
            <article>
                <p>Filtrer par</p>
                <Filter
                    v-model="organizationTypesFilter"
                    title="Type de structure"
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

const directoryStore = useDirectoryStore();
const organizationTypesFilter = computed({
    get() {
        return directoryStore.filters.organizationTypes;
    },
    set(newValue) {
        directoryStore.filters.organizationTypes = newValue;
    },
});
</script>
