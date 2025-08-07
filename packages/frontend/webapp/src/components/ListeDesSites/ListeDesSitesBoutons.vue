<template>
    <p class="flex flex-col gap-2 items-start xs:flex-row">
        <Button
            icon="print"
            iconPosition="left"
            variant="primaryOutline"
            :disabled="townsStore.filteredTowns.length === 0"
            @click="print"
            size="sm"
            class="!border-2 !border-primary hover:!bg-primary"
            >Imprimer</Button
        >
        <Button
            v-if="userStore.hasPermission('shantytown.export')"
            icon="file-excel"
            iconPosition="left"
            variant="primaryOutline"
            :disabled="townsStore.filteredTowns.length === 0"
            @click="showExport"
            size="sm"
            class="!border-2 !border-primary hover:!bg-primary"
            >Exporter</Button
        >
        <Button
            v-if="userStore.hasPermission('shantytown.create')"
            href="/site/nouveau"
            icon="plus"
            iconPosition="left"
            variant="primary"
            size="sm"
            class="!border-2 !border-primary hover:!bg-primaryDark"
        >
            Déclarer un nouveau site
        </Button>
        <Button
            v-else
            href="/site/signalement"
            icon="plus"
            iconPosition="left"
            variant="primary"
            size="sm"
        >
            Informer d'un nouveau site
        </Button>
    </p>
</template>

<script setup>
import { useTownsStore } from "@/stores/towns.store";
import { useUserStore } from "@/stores/user.store";
import { trackEvent } from "@/helpers/matomo";

import { Button } from "@resorptionbidonvilles/ui";
import ListeDesSitesExport from "./ListeDesSitesExport/ListeDesSitesExport.vue";
import { useModaleStore } from "@/stores/modale.store";

const townsStore = useTownsStore();
const userStore = useUserStore();

function print() {
    window.print();
    trackEvent("Impression", "Impression liste des sites");
}

function showExport() {
    const modaleStore = useModaleStore();
    modaleStore.open(ListeDesSitesExport);
}
</script>

<style scoped>
button {
    border: inherit;
}
</style>
