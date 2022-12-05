<template>
    <ul class="list-none ml-4">
        <TableauDeBordSiteFiltre
            v-for="item in items"
            :key="item.id"
            :item="item"
            @click="setFilter(item.id)"
            >{{ item.label }} ({{ dashboardStore.towns.data[item.id].length }})
            <template v-if="item.sublabel"
                ><br /><span
                    class="inline-block w-full font-normal text-center"
                    :class="item.active ? 'visible' : 'invisible'"
                    >{{ item.sublabel }}</span
                ></template
            >
        </TableauDeBordSiteFiltre>
    </ul>
</template>

<script setup>
import { computed } from "vue";
import { useDashboardStore } from "@/stores/dashboard.store";
import TableauDeBordSiteFiltre from "./TableauDeBordSiteFiltre/TableauDeBordSiteFiltre.vue";
import { trackEvent } from "@/helpers/matomo";

const dashboardStore = useDashboardStore();
const items = computed(() => {
    const rawItems = [
        {
            id: "my_shantytowns",
            type: "link",
            label: "Mes sites",
            track_id: "Mes sites",
        },
        { type: "separator", label: "", id: "separator_1" },
        {
            id: "new_shantytowns",
            type: "link",
            label: "Nouveaux sites déclarés",
            sublabel: "Sur les 30 derniers jours",
            track_id: "Nouveaux sites",
        },
        { type: "separator", label: "", id: "separator_2" },
        {
            id: "shantytowns_with_target",
            type: "link",
            label: "Objectifs de résorption",
            track_id: "Objectifs de résorption",
        },
        { type: "separator", label: "", id: "separator_3" },
        {
            id: "my_territory",
            type: "link",
            label: dashboardStore.isOnDefaultLocation
                ? "Mon territoire"
                : dashboardStore.currentLocationName,
            track_id: "Tout le territoire",
        },
    ];

    return rawItems.map((item) => {
        return {
            ...item,
            active: item.id === dashboardStore.towns.filter,
        };
    });
});

function setFilter(id) {
    if (!id || id === dashboardStore.towns.filter) {
        return;
    }

    const { track_id: trackId } = items.value.find((item) => item.id === id);
    trackEvent("TB", `Sites ${trackId}`);
    dashboardStore.setTownFilter(id);
}
</script>
