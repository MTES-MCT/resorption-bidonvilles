<template>
    <ViewHeader icon="key">
        <template v-slot:title>Gestion des accès</template>
        <template v-slot:description
            >Traitez les demandes d'accès sur votre territoire</template
        >
        <template v-slot:actions>
            <p class="flex space-x-2">
                <DsfrButton
                    icon="bxs:file-pdf"
                    secondary
                    size="sm"
                    @click="downloadGuide"
                >
                    Guide des accès</DsfrButton
                >
                <DsfrButton
                    v-if="exportList.length > 0"
                    @click="openModalExport"
                    icon="ri-file-excel-fill"
                    secondary
                    size="sm"
                >
                    Exporter</DsfrButton
                >
                <DsfrButton
                    @click="navigateTo('/nouvel-utilisateur')"
                    icon="fr-icon-user-add-fill"
                    size="sm"
                >
                    Ajouter un utilisateur</DsfrButton
                >
                <DsfrButton
                    @click="navigateTo('/nouvelle-structure')"
                    icon="fr-icon-hotel-line"
                    size="sm"
                >
                    Créer une structure</DsfrButton
                >
            </p>
        </template>
    </ViewHeader>
</template>

<script setup>
import { useModaleStore } from "@/stores/modale.store";
import exportList from "./ListeDemandeAcces.exports";
import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";
import ModalExport from "@/components/ModalExport/ModalExport.vue";
import { useRouter } from "vue-router";

const router = useRouter();

function downloadGuide() {
    window.open("/doc/guide_de_l_administrateur.pdf");
}

const navigateTo = (target) => {
    router.push(`${target}`);
};

function openModalExport() {
    const modaleStore = useModaleStore();
    modaleStore.open(ModalExport, {
        exports: exportList,
    });
}
</script>
