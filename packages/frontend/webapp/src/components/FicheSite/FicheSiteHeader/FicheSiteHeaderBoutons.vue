<template>
    <div
        class="flex flex-col justify-between items-start gap-2 sm:flex-row sm:items-center"
    >
        <div
            class="flex flex-col items-start gap-2 sm:flex-row sm:items-center"
        >
            <RouterLink
                to="#journal_du_site"
                v-if="
                    userStore.hasLocalizedPermission(
                        'shantytown_comment.list',
                        town
                    )
                "
            >
                <DsfrButton
                    size="sm"
                    icon="fr-icon-chat-3-fill"
                    secondary
                    tabindex="-1"
                    >Journal du site</DsfrButton
                >
            </RouterLink>
            <DsfrButton
                size="sm"
                icon="ri-file-word-fill"
                secondary
                @click="openExportModal"
                >Exporter</DsfrButton
            >
            <DsfrButton
                v-if="
                    userStore.hasLocalizedPermission(
                        'shantytown.close',
                        town
                    ) && town.status === 'open'
                "
                size="sm"
                icon="mdi:home-remove-outline"
                @click="navigateTo(town.id, 'fermeture')"
                >Fermer le site</DsfrButton
            >

            <DsfrButton
                v-if="
                    userStore.hasLocalizedPermission(
                        'shantytown.fix_status',
                        town
                    ) && town.status !== 'open'
                "
                size="sm"
                icon="mdi:home-remove-outline"
                @click="navigateTo(town.id, 'fermeture')"
                >Corriger la fermeture du site</DsfrButton
            >
            <DsfrButton
                size="sm"
                icon="fr-icon-pencil-line"
                v-if="
                    userStore.hasLocalizedPermission(
                        'shantytown.update',
                        town
                    ) && town.status === 'open'
                "
                @click="navigateTo(town.id, 'mise-a-jour')"
                >Mettre à jour</DsfrButton
            >
            <DsfrButton
                v-if="displayStartResorptionButton"
                size="sm"
                icon="mdi:play"
                @click="startResorption"
                :disabled="startResorptionIsLoading"
                >Démarrer la résorption</DsfrButton
            >
            <DsfrButton
                v-if="
                    userStore.hasLocalizedPermission('shantytown.delete', town)
                "
                size="sm"
                icon="mdi:delete-outline"
                @click="deleteTown"
                :disabled="deleteIsLoading"
                >Supprimer le site</DsfrButton
            >
        </div>
        <div
            class="flex flex-col items-start gap-2 sm:flex-row sm:items-center"
        >
            <DsfrButton
                v-if="canMarkAsResorptionTarget"
                size="sm"
                icon="ri-focus-2-line"
                secondary
                @click="markAsResorptionTarget"
                :disabled="resorptionTargetIsLoading"
                >Objectif résorption</DsfrButton
            >
            <DsfrButton
                size="sm"
                :label="
                    heatwaveStatus
                        ? 'Supprimer l\'alerte Canicule'
                        : 'Activer l\'alerte Canicule'
                "
                icon="ri:sun-fill"
                secondary
                :disabled="heatwaveRequestStatus?.loading"
                @click.prevent.stop="toggleHeatwave"
            />
        </div>
    </div>
</template>

<script setup>
import { computed, defineProps, toRefs, ref, nextTick } from "vue";
import { RouterLink } from "vue-router";
import { useUserStore } from "@/stores/user.store";
import { useNotificationStore } from "@/stores/notification.store";
import { useTownsStore } from "@/stores/towns.store";
import { useModaleStore } from "@/stores/modale.store";
import router from "@/helpers/router";

import FicheSiteModaleExport from "../FicheSiteModaleExport/FicheSiteModaleExport.vue";

import { useConfigStore } from "@/stores/config.store";
import { usePhasesPreparatoiresResorption } from "@/utils/usePhasesPreparatoiresResorption";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
const userStore = useUserStore();
const notificationStore = useNotificationStore();
const townsStore = useTownsStore();

const { displayPhasesPreparatoiresResorption } =
    usePhasesPreparatoiresResorption(town);

function openExportModal() {
    const modaleStore = useModaleStore();
    modaleStore.open(FicheSiteModaleExport, { town: town.value });
}

const navigateTo = (target, target2) => {
    router.push(`/site/${target}/${target2}`);
};

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

function hasAllPreparatoryPhases(preparatoryPhases, startingPhaseIds) {
    return startingPhaseIds.every((phaseId) =>
        preparatoryPhases.some((phase) => phase.preparatoryPhaseId === phaseId)
    );
}

const townIsClosed = computed(
    () => town.value.closedAt !== null && town.value.closedAt !== undefined
);

const hasRequiredPhasesStartingResorption = computed(() => {
    if (!town.value.preparatoryPhasesTowardResorption) {
        return false;
    }

    if (!Array.isArray(town.value.preparatoryPhasesTowardResorption)) {
        return false;
    }

    const configStore = useConfigStore();
    const requiredPhases =
        configStore.config?.preparatory_phases_toward_resorption.reduce(
            (acc, item) => {
                if (item.is_a_starting_phase) {
                    acc.push(item.uid);
                }
                return acc;
            },
            []
        );

    return hasAllPreparatoryPhases(
        town.value.preparatoryPhasesTowardResorption,
        requiredPhases
    );
});

async function startResorption() {
    if (startResorptionIsLoading.value === true) {
        return;
    }

    if (
        !confirm(
            "Êtes-vous sûr(e) de vouloir démarrer la résorption de ce site ?"
        )
    ) {
        return;
    }

    startResorptionIsLoading.value = true;

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

const displayStartResorptionButton = computed(() => {
    // Les admins nationaux peuvent créer des phases partout sans permission explicite
    const isNationalAdmin =
        userStore.user?.intervention_areas?.is_national === true;
    const hasPermission = userStore.hasLocalizedPermission(
        "shantytown_resorption.create",
        town.value
    );

    return (
        (isNationalAdmin || hasPermission) &&
        displayPhasesPreparatoiresResorption.value &&
        !hasRequiredPhasesStartingResorption.value &&
        !townIsClosed.value
    );
});

const heatwaveStatus = computed(() => {
    return town.value.heatwaveStatus;
});

const heatwaveRequestStatus = computed(() => {
    return townsStore.heatwaveStatuses[town.value.id] || null;
});

const canMarkAsResorptionTarget = computed(() => {
    if (town.value.closedAt !== null) {
        return false;
    }

    if (town.value.resorptionTarget !== null) {
        return false;
    }

    const userRoles = userStore.user?.role_id;
    const allowedRoles = [
        "national_admin",
        "local_admin",
        "direct_collaborator",
    ];

    return allowedRoles.includes(userRoles);
});

const resorptionTargetIsLoading = ref(false);

async function markAsResorptionTarget() {
    if (resorptionTargetIsLoading.value === true) {
        return;
    }

    const currentYear = new Date().getFullYear();
    if (
        !confirm(
            `Êtes-vous sûr(e) de vouloir marquer ce site comme "Objectif résorption ${currentYear}" ?`
        )
    ) {
        return;
    }

    resorptionTargetIsLoading.value = true;

    try {
        await townsStore.setResorptionTarget(town.value.id);
        notificationStore.success(
            "Objectif résorption",
            `Le site a été marqué "Objectif résorption ${currentYear}"`
        );
    } catch (e) {
        notificationStore.error(
            "Objectif résorption",
            e?.user_message || "Une erreur inconnue est survenue"
        );
    }

    resorptionTargetIsLoading.value = false;
}

async function toggleHeatwave() {
    try {
        await townsStore.setHeatwaveStatus(
            town.value.id,
            !town.value.heatwaveStatus
        );
    } catch {
        notificationStore.error(
            "Risque canicule",
            "Une erreur inconnue est survenue"
        );
        return;
    }

    if (heatwaveRequestStatus.value?.error !== null) {
        notificationStore.error(
            "Risque canicule",
            heatwaveRequestStatus.value.error
        );
    } else {
        notificationStore.success(
            "Risque canicule",
            town.value.heatwaveStatus === true
                ? "Le site a été marqué comme particulièrement exposé à la canicule"
                : "Le site n'est plus marqué comme à risque"
        );
    }
}
</script>

<style scoped>
button {
    border: inherit;
}
</style>
