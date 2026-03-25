<template>
    <ViewHeader :icon="icon">
        <template v-slot:title>{{ title }}</template>
        <template v-slot:description>{{ description }}</template>
        <template v-slot:actions>
            <p
                class="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0"
            >
                <!-- Boutons communs à toutes les pages d'administration -->
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

                <!-- Bouton spécifique aux logs de connexion -->
                <DsfrButton
                    v-if="
                        showLogsButton &&
                        userStore.user?.role_id === 'national_admin'
                    "
                    @click="navigateTo('/logs-connexion')"
                    icon="ri-key-fill"
                    size="sm"
                >
                    Logs de connexion</DsfrButton
                >

                <!-- Bouton "Gérer les accès" sur la page des logs -->
                <DsfrButton
                    v-if="
                        !showLogsButton &&
                        userStore.user?.role_id === 'national_admin'
                    "
                    @click="navigateTo('/acces')"
                    icon="ri-key-fill"
                    size="sm"
                >
                    Gérer les accès</DsfrButton
                >

                <!-- Slot pour boutons additionnels spécifiques à chaque page -->
                <slot name="additional-actions"></slot>
            </p>
        </template>
    </ViewHeader>
</template>

<script setup>
import { useModaleStore } from "@/stores/modale.store";
import exportList from "../ListeDemandeAcces/ListeDemandeAcces.exports";
import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";
import ModalExport from "@/components/ModalExport/ModalExport.vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user.store";

// Props pour configurer le header
defineProps({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        default: "key",
    },
    showLogsButton: {
        type: Boolean,
        default: true,
    },
});

const router = useRouter();
const userStore = useUserStore();

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
