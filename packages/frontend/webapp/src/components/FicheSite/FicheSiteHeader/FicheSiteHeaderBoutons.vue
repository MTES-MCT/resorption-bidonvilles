<template>
    <p class="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
        <RouterLink
            to="#journal_du_site"
            v-if="
                userStore.hasLocalizedPermission(
                    'shantytown_comment.list',
                    town
                )
            "
        >
            <Button
                size="sm"
                variant="primaryOutline"
                icon="comment"
                iconPosition="left"
                tabindex="-1"
                >Journal du site</Button
            >
        </RouterLink>
        <Button
            size="sm"
            icon="file-word"
            iconPosition="left"
            variant="primaryOutline"
            @click="openExportModal"
            >Exporter</Button
        >
        <Button
            v-if="
                userStore.hasLocalizedPermission('shantytown.close', town) &&
                town.status === 'open'
            "
            size="sm"
            variant="primary"
            icon="house-circle-xmark"
            iconPosition="left"
            :href="`/site/${town.id}/fermeture`"
            >Fermer le site</Button
        >

        <Button
            v-if="
                userStore.hasLocalizedPermission(
                    'shantytown.fix_status',
                    town
                ) && town.status !== 'open'
            "
            size="sm"
            variant="primary"
            icon="house-circle-xmark"
            iconPosition="left"
            :href="`/site/${town.id}/fermeture`"
            >Corriger la fermeture du site</Button
        >
        <Button
            size="sm"
            variant="primary"
            icon="pencil"
            iconPosition="left"
            v-if="
                userStore.hasLocalizedPermission('shantytown.update', town) &&
                town.status === 'open'
            "
            :href="`/site/${town.id}/mise-a-jour`"
            >Mettre à jour</Button
        >
        <Button
            v-if="
                userStore.hasLocalizedPermission(
                    'shantytown_resorption.create',
                    town
                ) && !hasRequiredPreparatoryPhases
            "
            size="sm"
            variant="primary"
            icon="fa-regular fa-play"
            iconPosition="left"
            @click="startResorption"
            :loading="startResorptionIsLoading"
            >Démarrer la résorption</Button
        >
        <Button
            v-if="userStore.hasLocalizedPermission('shantytown.delete', town)"
            size="sm"
            variant="primary"
            icon="fa-regular fa-trash-alt"
            iconPosition="left"
            @click="deleteTown"
            :loading="deleteIsLoading"
            >Supprimer le site</Button
        >
    </p>
</template>

<script setup>
import { computed, defineProps, toRefs, ref, nextTick } from "vue";
import { RouterLink } from "vue-router";
import { useUserStore } from "@/stores/user.store";
import { useNotificationStore } from "@/stores/notification.store";
import { useTownsStore } from "@/stores/towns.store";
import { useModaleStore } from "@/stores/modale.store";
import router from "@/helpers/router";

import { Button } from "@resorptionbidonvilles/ui";
import FicheSiteModaleExport from "../FicheSiteModaleExport/FicheSiteModaleExport.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
const userStore = useUserStore();

function openExportModal() {
    const modaleStore = useModaleStore();
    modaleStore.open(FicheSiteModaleExport, { town: town.value });
}

const deleteIsLoading = ref(false);
async function deleteTown() {
    if (deleteIsLoading.value === true) {
        return;
    }

    if (
        !confirm(
            "Êtes-vous sûr(e) de vouloir supprimer définitivement ce site ? Cette suppression est irréversible."
        )
    ) {
        return;
    }

    deleteIsLoading.value = true;

    try {
        const notificationStore = useNotificationStore();
        const townsStore = useTownsStore();
        router.replace("/liste-des-sites");

        nextTick(async () => {
            await townsStore.destroy(town.value.id);
            notificationStore.success(
                "Suppression du site",
                "Le site a été supprimé définitivement de la base"
            );
        });
    } catch (e) {
        alert(
            e?.user_message ||
                "Une erreur inconnue est survenue, la suppression n'a peut-être pas réussi"
        );
    }

    deleteIsLoading.value = false;
}

const startResorptionIsLoading = ref(false);

const hasRequiredPreparatoryPhases = computed(() => {
    if (!town.value.preparatoryPhasesTowardResorption) {
        return false;
    }

    const requiredPhases = [
        "political_validation",
        "social_assessment",
        "sociological_diagnosis",
    ];

    const phaseIds = new Set(
        town.value.preparatoryPhasesTowardResorption.map(
            (phase) => phase.preparatoryPhaseId
        )
    );

    return requiredPhases.every((requiredPhase) => phaseIds.has(requiredPhase));
});

async function startResorption() {
    if (startResorptionIsLoading.value === true) {
        return;
    }

    if (
        !confirm("Êtes-vous sûr(e) de vouloir démarrer la résorption ce site ?")
    ) {
        return;
    }

    startResorptionIsLoading.value = true;

    const notificationStore = useNotificationStore();
    const townsStore = useTownsStore();

    nextTick(async () => {
        try {
            await townsStore.startResorption(town.value.id);
            notificationStore.success(
                "Démarrage de la résorption",
                "La résorption du site a démarré"
            );
        } catch (err) {
            notificationStore.error(
                "Démarrage de la résorption",
                "Erreur rencontrée. " + err?.user_message
            );
        }
    });
    startResorptionIsLoading.value = false;
}
</script>
