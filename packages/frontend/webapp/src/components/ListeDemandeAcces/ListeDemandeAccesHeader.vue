<template>
    <ViewHeader icon="key">
        <template v-slot:title>Gestion des accès</template>
        <template v-slot:description
            >Traitez les demandes d'accès sur votre territoire</template
        >
        <template v-slot:actions>
            <p class="flex space-x-2">
                <Button
                    icon="file-pdf"
                    iconPosition="left"
                    variant="primaryOutline"
                    size="sm"
                    @click="downloadGuide"
                >
                    Guide des accès</Button
                >
                <Button
                    v-if="exportList.length > 0"
                    @click="openModalExport"
                    icon="file-excel"
                    iconPosition="left"
                    variant="primaryOutline"
                    size="sm"
                >
                    Exporter</Button
                >
                <Button
                    href="/nouvel-utilisateur"
                    icon="user-plus"
                    iconPosition="left"
                    variant="primary"
                    size="sm"
                >
                    Ajouter un utilisateur</Button
                >
                <Button
                    href="/nouvelle-structure"
                    icon="building"
                    iconPosition="left"
                    variant="primary"
                    size="sm"
                >
                    Créer une structure</Button
                >
            </p>
        </template>
    </ViewHeader>
</template>

<script setup>
import { useModaleStore } from "@/stores/modale.store";
import exportList from "./ListeDemandeAcces.exports";

import { Button } from "@resorptionbidonvilles/ui";
import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";
import ModalExport from "@/components/ModalExport/ModalExport.vue";

function downloadGuide() {
    window.location = "/doc/guide_de_l_administrateur.pdf";
}

function openModalExport() {
    const modaleStore = useModaleStore();
    modaleStore.open(ModalExport, {
        exports: exportList,
    });
}
</script>
