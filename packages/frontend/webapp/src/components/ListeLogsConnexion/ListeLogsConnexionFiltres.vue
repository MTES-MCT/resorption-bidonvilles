<template>
    <section
        class="flex flex-col sm:flex-row sm:items-end sm:space-x-8 space-y-4 sm:space-y-0 border-t border-b border-france-blue-925-100 py-4"
    >
        <article class="flex items-center space-x-2 h-10">
            <p class="whitespace-nowrap">Filtrer par:</p>
            <Filter
                v-model="statusFilter"
                title="Statut"
                :options="[
                    { value: 'success', label: 'Succès' },
                    { value: 'failure', label: 'Échec' },
                ]"
            />
        </article>
        <article
            class="flex flex-col sm:flex-row sm:items-end sm:space-x-4 space-y-4 sm:space-y-0"
        >
            <div class="w-full sm:flex-1">
                <DsfrSearchBar
                    v-model="logsStore.filters.search"
                    label="Rechercher par email"
                    label-visible
                    placeholder="Par mail"
                    class="search-with-hidden-label"
                />
            </div>
            <div class="w-full sm:flex-1">
                <DsfrSearchBar
                    v-model="logsStore.filters.ipAddress"
                    label="Rechercher par adresse IP"
                    label-visible
                    placeholder="Par IP"
                    class="search-with-hidden-label"
                />
            </div>
        </article>
    </section>
</template>

<script setup>
import { computed, watch, toRef } from "vue";
import { useForm } from "vee-validate";
import { useSigninLogsStore } from "@/stores/signinLogs.store";
import { Filter } from "@resorptionbidonvilles/ui";

const logsStore = useSigninLogsStore();

const statusFilter = computed({
    get() {
        return logsStore.filters.success;
    },
    set(newValue) {
        logsStore.filters.success = newValue;
    },
});

const { values } = useForm({
    initialValues: {
        searchFilter: logsStore.filters.search,
        ipFilter: logsStore.filters.ipAddress,
    },
});

const searchFilter = toRef(values, "searchFilter");
const ipFilter = toRef(values, "ipFilter");

watch(searchFilter, () => {
    logsStore.filters.search = searchFilter.value;
});

watch(ipFilter, () => {
    logsStore.filters.ipAddress = ipFilter.value;
});
</script>

<style scoped>
:deep(.search-with-hidden-label .fr-label) {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
    visibility: visible !important;
}
</style>
