<template>
    <p class="flex flex-col gap-2 items-start xs:flex-row">
        <DsfrButton
            icon="fr-icon-printer-line"
            secondary
            :disabled="townsStore.filteredTowns.length === 0"
            @click="print"
            size="sm"
            >Imprimer</DsfrButton
        >
        <Button
            v-if="userStore.hasPermission('shantytown.export')"
            icon="file-excel"
            iconPosition="left"
            variant="primaryOutline"
            :disabled="townsStore.filteredTowns.length === 0"
            @click="showExport"
            size="sm"
            class="!border !border-primary hover:!bg-primary"
            >Exporter</Button
        >
        <DsfrButton
            v-if="userStore.hasPermission('shantytown.create')"
            @click.prevent.stop="router.push('/site/nouveau')"
            icon="fr-icon-add-line"
            size="sm"
        >
            Déclarer un nouveau site
        </DsfrButton>
        <DsfrButton
            v-else
            @click.prevent.stop="router.push('/site/signalement')"
            icon="fr-icon-add-line"
            size="sm"
        >
            Informer d'un nouveau site
        </DsfrButton>
    </p>
</template>

<script setup>
import { useTownsStore } from "@/stores/towns.store";
import { useUserStore } from "@/stores/user.store";
import { trackEvent } from "@/helpers/matomo";
import router from "@/helpers/router";
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
