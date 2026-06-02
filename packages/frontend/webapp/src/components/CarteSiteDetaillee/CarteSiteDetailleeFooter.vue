<template>
    <div
        class="flex flex-wrap justify-end md:h-10 items-end m-4 gap-3 print:hidden sm:flex-row"
    >
        <DsfrButton
            v-if="isOpen && hasUpdateShantytownPermission"
            size="sm"
            label="Considérer à jour"
            icon="fr-icon-checkbox-line"
            secondary
            @click.prevent.stop="handleNoChangeModalIfNeeded"
        />
        <DsfrButton
            v-if="isOpen"
            size="sm"
            :label="
                heatwaveStatus
                    ? 'Supprimer l\'alerte Canicule'
                    : 'Alerte Canicule'
            "
            icon="ri:sun-fill"
            secondary
            no-outline
            :disabled="heatwaveRequestStatus?.loading"
            @click.prevent.stop="toggleHeatwave"
        />
        <DsfrButton
            v-if="canMarkAsResorptionTarget"
            size="sm"
            label="Objectif résorption"
            icon="ri-focus-2-line"
            secondary
            :disabled="resorptionTargetIsLoading"
            @click.prevent.stop="markAsResorptionTarget"
        />
        <DsfrButton
            v-if="isOpen && hasUpdateShantytownPermission"
            size="sm"
            label="Mettre à jour"
            icon="fr-icon-pencil-line"
            secondary
            @click.prevent.stop="navigateTo('mise-a-jour')"
        />
        <DsfrButton
            size="sm"
            label="Voir la fiche du site"
            icon="fr-icon-arrow-right-line"
            primary
            @click.prevent.stop="navigateTo(null)"
        />
    </div>
    <ModaleMajSiteSansModification ref="modaleMajSiteSansModification" />
</template>

<script setup>
import { computed, markRaw, toRefs } from "vue";
import { useUserStore } from "@/stores/user.store";
import { useNotificationStore } from "@/stores/notification.store";
import { useTownsStore } from "@/stores/towns.store";
import { useModaleStore } from "@/stores/modale.store";
import { trackEvent } from "@/helpers/matomo";
import { useResorptionTarget } from "@/utils/useResorptionTarget";

import router from "@/helpers/router";

const props = defineProps({
    shantytown: Object,
});
const userStore = useUserStore();
const notificationStore = useNotificationStore();
const townsStore = useTownsStore();
const { shantytown } = toRefs(props);

const shantytownId = computed(() => shantytown.value.id);
const { resorptionTargetIsLoading, markAsResorptionTarget } =
    useResorptionTarget(shantytownId);

const hasUpdateShantytownPermission = computed(() => {
    return userStore.hasUpdateShantytownPermission(shantytown.value);
});

const heatwaveStatus = computed(() => {
    return shantytown.value.heatwaveStatus;
});

const heatwaveRequestStatus = computed(() => {
    return townsStore.heatwaveStatuses[shantytown.value.id] || null;
});
const isOpen = computed(() => {
    return shantytown.value.status === "open";
});

const canMarkAsResorptionTarget = computed(() => {
    if (shantytown.value.closedAt !== null) {
        return false;
    }

    if (shantytown.value.resorptionTarget !== null) {
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

async function toggleHeatwave() {
    try {
        await townsStore.setHeatwaveStatus(
            shantytown.value.id,
            !heatwaveStatus.value
        );
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log("Erreur lors de la modification du statut canicule :", e);

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
            heatwaveStatus.value === true
                ? "Le site a été marqué comme particulièrement exposé à la canicule"
                : "Le site n'est plus marqué comme à risque"
        );
    }
}

const navigateTo = (target) => {
    if (shantytown.value && shantytown.value.id) {
        let path = `/site/${shantytown.value.id}`;
        if (target) {
            path += `/${target}`;
        }
        router.push(path);
    }
};

async function handleNoChangeModalIfNeeded() {
    if (shantytownId.value) {
        const modaleStore = useModaleStore();
        shantytown.value.updatedWithoutAnyChange = true;
        const { default: ModaleMajSiteSansModification } = await import(
            "@/components/ModaleMajSiteSansModification/ModaleMajSiteSansModification.vue"
        );

        const submitWithoutChanges = async () => {
            const submit = async (id) => {
                try {
                    const townUpdateResult =
                        await townsStore.forceUpdateWithoutChanges(id);

                    // Certains appels renvoient directement la donnée, d'autres un objet enveloppé
                    const responseData =
                        townUpdateResult?.data ?? townUpdateResult;

                    if (responseData?.error) {
                        throw new Error(responseData.error);
                    }

                    notificationStore.success(
                        "Mise à jour sans modification",
                        "Le site a été mis à jour sans modification"
                    );
                    trackEvent("Site", "Mise à jour site", `S${id}`);
                    return responseData;
                } catch (error) {
                    const message =
                        error?.response?.data?.user_message ||
                        error?.user_message ||
                        error?.message ||
                        "Une erreur inconnue est survenue";

                    notificationStore.error(
                        "Mise à jour sans modification",
                        message
                    );
                    throw error;
                }
            };
            await submit(shantytown.value?.id);
        };

        modaleStore.open(markRaw(ModaleMajSiteSansModification), {
            onConfirm: submitWithoutChanges,
        });
        return true;
    }
    return false;
}
</script>

<style scoped>
button {
    border: inherit;
}
</style>
