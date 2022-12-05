<template>
    <LayoutLoading v-if="directoryStore.isLoading !== false"></LayoutLoading>

    <LayoutError v-else-if="directoryStore.error !== null">
        <template v-slot:title>Communauté inaccessible</template>
        <template v-slot:code>{{ directoryStore.error }}</template>
        <template v-slot:content
            >Vous souhaitiez consulter notre communauté d'acteurs de la
            résorption des bidonvilles en France, mais nous ne parvenons pas à
            collecter les informations nécessaires. Vous pouvez réessayer un peu
            plus tard ou nous contacter en cas d'urgence.</template
        >
        <template v-slot:actions>
            <Button
                icon="rotate-right"
                iconPosition="left"
                type="button"
                @click="load"
                >Réessayer</Button
            >
            <ButtonContact />
        </template>
    </LayoutError>

    <LayoutSearch
        v-else
        allowFreeSearch
        searchTitle="Vous recherchez un contact, une structure, les acteurs d'un territoire ?"
        searchPlaceholder="Département, nom de la structure"
        showNationalWording="Voir tous les acteurs de France"
        v-model:location="location"
    >
        <Annuaire />
    </LayoutSearch>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useDirectoryStore } from "@/stores/directory.store";
import Annuaire from "@/components/Annuaire/Annuaire.vue";

import { Button } from "@resorptionbidonvilles/ui";
import LayoutError from "@/components/LayoutError/LayoutError.vue";
import LayoutLoading from "@/components/LayoutLoading/LayoutLoading.vue";
import LayoutSearch from "@/components/LayoutSearch/LayoutSearch.vue";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";

const directoryStore = useDirectoryStore();
const location = computed({
    get() {
        return {
            search: directoryStore.filters.search,
            data: directoryStore.filters.location,
        };
    },
    set(newValue) {
        if (!newValue) {
            directoryStore.filters.search = "";
            directoryStore.filters.location = null;
        } else {
            directoryStore.filters.search = newValue?.search;
            directoryStore.filters.location = newValue?.data;
        }
    },
});

onMounted(() => {
    if (!directoryStore.isLoaded) {
        load();
    }
});

function load() {
    directoryStore.fetchDirectory();
}
</script>
