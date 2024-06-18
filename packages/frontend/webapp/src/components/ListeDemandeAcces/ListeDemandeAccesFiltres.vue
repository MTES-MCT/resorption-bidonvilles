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
                        value: 'refused',
                        label: 'Sans suite',
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
                name="searchFilter"
                variant="filter"
            />
        </article>
    </section>
</template>

<script setup>
import { computed } from "vue";
import { useForm } from "vee-validate";
import { useAccesStore } from "@/stores/acces.store";
import { Filter, TextInput } from "@resorptionbidonvilles/ui";
import { watch } from "vue";
import { toRef } from "vue";

const accesStore = useAccesStore();
const statusFilter = computed({
    get() {
        return accesStore.filters.status;
    },
    set(newValue) {
        accesStore.filters.status = newValue;
    },
});

const { values } = useForm({
    initialValues: {
        searchFilter: accesStore.filters.search,
    },
});
const searchFilter = toRef(values, "searchFilter");
watch(searchFilter, () => {
    accesStore.filters.search = searchFilter.value;
});
</script>
