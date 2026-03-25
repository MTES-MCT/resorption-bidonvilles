<template>
    <section
        class="flex flex-col sm:flex-row sm:items-end sm:space-x-8 space-y-4 sm:space-y-0 border-t border-b border-france-blue-925-100 py-4"
    >
        <article class="flex items-center space-x-2 h-10">
            <p class="whitespace-nowrap">Filtrer par:</p>
            <Filter
                v-model="statusFilter"
                title="Statut du compte"
                :options="statusOptions"
            />
        </article>
        <article class="w-full sm:flex-1">
            <DsfrSearchBar
                v-model="accesStore.filters.search"
                label="Rechercher par utilisateur, structure, territoire, type d'accès"
                placeholder="Rechercher par utilisateur, structure, territoire, type d'accès"
            />
        </article>
    </section>
</template>

<script setup>
import { computed } from "vue";
import { useAccesStore } from "@/stores/acces.store";
import { Filter } from "@resorptionbidonvilles/ui";

const accesStore = useAccesStore();

const statusOptions = [
    { label: "Demandé", name: "requested", value: "requested" },
    { label: "Expiré", name: "expired", value: "expired" },
    { label: "Envoyé", name: "sent", value: "sent" },
    { label: "Activé", name: "activated", value: "activated" },
    { label: "Sans suite", name: "refused", value: "refused" },
    { label: "Désactivé", name: "deactivated", value: "deactivated" },
];

const statusFilter = computed({
    get() {
        return accesStore.filters.status;
    },
    set(newValue) {
        accesStore.filters.status = newValue;
    },
});
</script>
