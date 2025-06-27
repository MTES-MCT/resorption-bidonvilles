<template>
    <div class="flex justify-end h-14 items-center mr-4 space-x-4 print:hidden">
        <DsfrButton
            v-if="isOpen"
            size="sm"
            :label="
                heatwaveStatus
                    ? 'Supprimer l\'alerte Canicule'
                    : 'Alerte Canicule'
            "
            icon="fr-icon-thermometer-line"
            class="hover:!text-white"
            secondary
            no-outline
            :disabled="heatwaveRequestStatus?.loading"
            @click.prevent.stop="toggleHeatwave"
        />
        <DsfrButton
            v-if="isOpen && hasUpdateShantytownPermission"
            size="sm"
            label="Mettre à jour"
            icon="fr-icon-pencil-line"
            secondary
            class="hover:!text-white"
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
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import { useUserStore } from "@/stores/user.store";
import { useNotificationStore } from "@/stores/notification.store";
import { useTownsStore } from "@/stores/towns.store";

import router from "@/helpers/router";

const props = defineProps({
    shantytown: Object,
});
const userStore = useUserStore();
const notificationStore = useNotificationStore();
const townsStore = useTownsStore();
const { shantytown } = toRefs(props);

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
</script>

<style scoped>
button {
    border: inherit;
}
</style>
