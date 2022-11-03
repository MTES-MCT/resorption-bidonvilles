<template>
    <div class="flex justify-end h-14 items-center mr-4 space-x-4 print:hidden">
        <Button
            v-if="isHover"
            variant="primaryOutline"
            icon="fa-regular fa-sun"
            iconPosition="left"
            type="button"
            size="sm"
            @click="toggleHeatwave"
        >
            <template v-if="heatwaveStatus === false"
                >Indiquer un risque "Canicule"</template
            >
            <template v-else>Retirer le risque "Canicule"</template>
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
            <Icon icon="arrow-right" /> Voir la fiche du site</Link
        >
    </div>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import { useUserStore } from "@/stores/user.store";
import { setHeatwaveStatus } from "@/api/towns.api";
import { trackEvent } from "@/helpers/matomo";

import { Icon, Button, Link } from "@resorptionbidonvilles/ui";

const props = defineProps({
    shantytown: Object,
    isHover: {
        type: Boolean,
        default: false,
    },
});
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

async function toggleHeatwave(event) {
    event.preventDefault();
    const value = !heatwaveStatus.value;

    try {
        // @todo : déplacer dans le store
        await setHeatwaveStatus(shantytown.value.id, {
            heatwave_status: value,
        });
        trackEvent(
            "Site",
            `${value ? "Déclenchement" : "Suppression"} alerte canicule`,
            `S${shantytown.value.id}`
        );
    } catch (e) {
        // @todo
    }
}
</script>
