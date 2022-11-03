<template>
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

<script setup>
import { useTownsStore } from "@/stores/towns.store";
import { useUserStore } from "@/stores/user.store";
import { trackEvent } from "@/helpers/matomo";

import { Button } from "@resorptionbidonvilles/ui";

const townsStore = useTownsStore();
const userStore = useUserStore();

function print() {
    window.print();
    trackEvent("Impression", "Impression liste des sites");
}

function showExport() {}
</script>
