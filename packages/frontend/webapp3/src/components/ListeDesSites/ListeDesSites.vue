<template>
    <ContentWrapper>
        <TabList :tabs="tabs" v-model="currentTab" class="mb-4 print:hidden" />

        <ViewHeader icon="tent">
            <template v-slot:title>Liste des sites</template>
            <template v-slot:description
                >Consultez et gérez la liste des sites au national ou sur votre
                territoire</template
            >
            <template v-slot:actions>
                <p class="flex space-x-2">
                    <Button
                        icon="print"
                        iconPosition="left"
                        variant="primaryOutline"
                        :disabled="townsStore.filteredTowns.length === 0"
                        @click="print"
                        size="sm"
                        >Imprimer</Button
                    >
                    <Button
                        v-if="userStore.hasPermission('shantytown.export')"
                        icon="file-excel"
                        iconPosition="left"
                        variant="primary"
                        :disabled="townsStore.filteredTowns.length === 0"
                        @click="showExport"
                        size="sm"
                        >Exporter</Button
                    >
                    <Button
                        v-if="userStore.hasPermission('shantytown.create')"
                        href="/nouveau-site"
                        icon="plus"
                        iconPosition="left"
                        variant="secondary"
                        size="sm"
                    >
                        Déclarer un nouveau site
                    </Button>
                </p>
            </template>
        </ViewHeader>

        <Loading v-if="townsStore.isLoading !== false" />

        <ViewError v-else-if="townsStore.error">
            <template v-slot:title>Liste des sites indisponible</template>
            <template v-slot:code>{{ townsStore.error }}</template>
            <template v-slot:content
                >Vous souhaitiez accéder à la liste des sites mais la collecte
                des données a échoué. Vous pouvez réessayer un peu plus tard ou
                nous contacter en cas d'urgence.</template
            >
            <template v-slot:actions>
                <Button
                    icon="rotate-right"
                    iconPosition="left"
                    type="button"
                    @clicked="townsStore.fetchTowns"
                    >Réessayer</Button
                >
                <ButtonContact />
            </template>
        </ViewError>

        <template v-else>
            <ListeDesSitesHeader />
            <ListeDesSitesFiltres class="mt-4" />
            <ListeDesSitesListe
                class="mt-4"
                v-if="townsStore.filteredTowns.length > 0"
            />
            <ListeDesSitesVide class="mt-10" v-else />
        </template>
    </ContentWrapper>
</template>

<script setup>
import { computed, watch } from "vue";
import { useUserStore } from "@/stores/user.store";
import { useTownsStore } from "@/stores/towns.store";

import { Button, TabList } from "@resorptionbidonvilles/ui";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";
import Loading from "@/components/Loading/Loading.vue";
import ViewError from "@/components/ViewError/ViewError.vue";
import ListeDesSitesHeader from "./ListeDesSitesHeader.vue";
import ListeDesSitesFiltres from "./ListeDesSitesFiltres.vue";
import ListeDesSitesListe from "./ListeDesSitesListe.vue";
import ListeDesSitesVide from "./ListeDesSitesVide.vue";
import { trackEvent } from "@/helpers/matomo";

const userStore = useUserStore();
const townsStore = useTownsStore();
const tabs = [
    { id: "open", label: "Sites existants" },
    { id: "close", label: "Sites fermés" },
];
const currentTab = computed({
    get() {
        return townsStore.filters.status;
    },
    set(newValue) {
        townsStore.filters.status = newValue;
    },
});

watch(currentTab, () => {
    if (currentTab.value === "close") {
        townsStore.sort = "closedAt";
    } else {
        townsStore.sort = "updatedAt";
    }
});

function print() {
    window.print();
    trackEvent("Impression", "Impression liste des sites");
}

function showExport() {}
</script>
