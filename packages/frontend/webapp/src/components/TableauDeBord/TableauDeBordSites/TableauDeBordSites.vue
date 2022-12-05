<template>
    <TableauDeBordSection title="Sites" id="sites">
        <template
            v-slot:header_left
            v-if="!townsStore.isLoading && !townsStore.error"
        >
            <TableauDeBordSitesFiltres />
        </template>

        <TableauDeBordSitesListe />
    </TableauDeBordSection>
</template>

<script setup>
import { useTownsStore } from "@/stores/towns.store";
import TableauDeBordSection from "../TableauDeBordSection.vue";
import TableauDeBordSitesFiltres from "./TableauDeBordSitesFiltres.vue";
import TableauDeBordSitesListe from "./TableauDeBordSitesListe.vue";

const townsStore = useTownsStore();
</script>
