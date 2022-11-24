<template>
    <div class="flex justify-end h-14 items-center mr-4 space-x-4 print:hidden">
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
            <Icon icon="arrow-right" /> Voir la fiche du site</Link
        >
    </div>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import { useNotificationStore } from "@/stores/notification.store";
import { useTownsStore } from "@/stores/towns.store";
import { useUserStore } from "@/stores/user.store";

import { Icon, Button, Link } from "@resorptionbidonvilles/ui";

const props = defineProps({
    shantytown: Object,
    isHover: {
        type: Boolean,
        default: false,
    },
});
const notificationStore = useNotificationStore();
const townsStore = useTownsStore();
const userStore = useUserStore();
const { shantytown, isHover } = toRefs(props);

const hasUpdateShantytownPermission = computed(() => {
    return userStore.hasUpdateShantytownPermission(shantytown.value);
});
const heatwaveStatus = computed(() => {
    return shantytown.value.heatwaveStatus;
});
const isOpen = computed(() => {
    return shantytown.value.status === "open";
});
const heatwaveRequestStatus = computed(() => {
    return townsStore.heatwaveStatuses[shantytown.value.id] || null;
});

async function toggleHeatwave(event) {
    event.preventDefault(); // éviter que le clic ne redirige vers la fiche site
    await townsStore.setHeatwaveStatus(
        shantytown.value.id,
        !heatwaveStatus.value
    );

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
