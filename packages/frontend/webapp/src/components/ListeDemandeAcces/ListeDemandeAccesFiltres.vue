<template>
    <section class="flex items-end space-x-8">
        <article>
            <p>Filtrer par</p>
            <Filter
                v-model="statusFilter"
                title="Statut du compte"
                :options="[
                    { value: 'requested', label: 'Demandé' },
                    { value: 'expired', label: 'Expiré' },
                    {
                        value: 'sent',
                        label: 'Envoyé',
                    },
                    {
                        value: 'activated',
                        label: 'Activé',
                    },
                    {
                        value: 'deactivated',
                        label: 'Désactivé',
                    },
                ]"
            />
        </article>
        <article class="flex-1">
            <label
                >Rechercher par utilisateur, structure, territoire, type
                d'accès</label
            >
            <TextInput
                :withoutMargin="true"
                prefixIcon="search"
                v-model="searchFilter"
                variant="filter"
            />
        </article>
    </section>
</template>

<script setup>
import { computed } from "vue";
import { useAccesStore } from "@/stores/acces.store";
import { Filter, TextInput } from "@resorptionbidonvilles/ui";

const accesStore = useAccesStore();
const statusFilter = computed({
    get() {
        return accesStore.filters.status;
    },
    set(newValue) {
        accesStore.filters.status = newValue;
    },
});
const searchFilter = computed({
    get() {
        return accesStore.filters.search;
    },
    set(newValue) {
        accesStore.filters.search = newValue;
    },
});
</script>
