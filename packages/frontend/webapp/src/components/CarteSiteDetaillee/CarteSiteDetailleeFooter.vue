<template>
    <div class="flex justify-end h-14 items-center mr-4 space-x-4 print:hidden">
        <Button
            v-if="isHover"
            variant="primaryOutline"
            icon="temperature-high"
            iconPosition="left"
            type="button"
            size="sm"
            :loading="heatwaveRequestStatus?.loading === true"
            @click.prevent="toggleHeatwave"
        >
            <template v-if="heatwaveStatus === false">Alerte Canicule</template>
            <template v-else>Supprimer l'alerte Canicule</template>
        </Button>
        <Button
            v-if="isHover && isOpen && hasUpdateShantytownPermission"
            variant="primaryOutline"
            size="sm"
            icon="pencil-alt"
            iconPosition="left"
            :href="`/site/${shantytown.id}/mise-a-jour`"
            >Mettre à jour</Button
        >
        <Link :to="`/site/${shantytown.id}`">
            <Icon
                :aria-label="`Voir la fiche du site ${
                    shantytown.addressSimple
                } ${shantytown.name ? shantytown.name : ''} ${
                    shantytown.city.name
                }
                }`"
                icon="arrow-right"
            />
            <span class="ml-2" aria-hidden="true"
                >Voir la fiche du site</span
            ></Link
        >
    </div>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import { useUserStore } from "@/stores/user.store";
import { useNotificationStore } from "@/stores/notification.store";
import { useTownsStore } from "@/stores/towns.store";

import { Icon, Button, Link } from "@resorptionbidonvilles/ui";

const props = defineProps({
    shantytown: Object,
    isHover: {
        type: Boolean,
        default: false,
    },
});
const userStore = useUserStore();
const notificationStore = useNotificationStore();
const townsStore = useTownsStore();
const { shantytown, isHover } = toRefs(props);

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
</script>
