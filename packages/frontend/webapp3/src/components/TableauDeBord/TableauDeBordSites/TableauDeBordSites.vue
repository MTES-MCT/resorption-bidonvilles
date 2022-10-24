<template>
    <TableauDeBordSection title="Sites" id="sites">
        <template
            v-slot:header_left
            v-if="!townsStore.isLoading && !townsStore.error"
        >
            <TableauDeBordSitesFiltres />
            <TableauDeBordSitesFormat :tabs="tabs" />
        </template>

        <TableauDeBordSitesListe />
    </TableauDeBordSection>
</template>

<script setup>
import { useTownsStore } from "@/stores/towns.store";
import TableauDeBordSection from "../TableauDeBordSection.vue";
import TableauDeBordSitesFiltres from "./TableauDeBordSitesFiltres.vue";
import TableauDeBordSitesListe from "./TableauDeBordSitesListe.vue";
import TableauDeBordSitesFormat from "./TableauDeBordSitesFormat.vue";

const tabs = [
    { id: "thumbnail", label: "Vignettes", track_id: "vignettes" },
    { id: "map", label: "Carte", track_id: "carto" },
];
const townsStore = useTownsStore();
</script>
