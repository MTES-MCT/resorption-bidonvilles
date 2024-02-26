<template>
    <ul class="list-none ml-4 tbd-sites-filtres">
        <TableauDeBordSiteFiltreItem
            v-for="item in items"
            :key="item.id"
            class="inline-flex items-start"
            v-bind="item"
            @click="setFilter(item.id)"
            @keyup.enter.exact="setFilter(item.id)"
        >
            <Button
                type="button"
                variant="text"
                :id="`btn-${item.id}`"
                role="tab"
                :aria-selected="item.ariaSelected"
                :aria-controls="`tabpanel-${item.id}`"
            >
                <span
                    >{{ item.label }} ({{
                        dashboardStore.towns.data[item.id].length
                    }})
                    <template v-if="item.sublabel"
                        ><br /><span
                            class="inline-block w-full font-normal text-center"
                            :class="item.active ? 'visible' : 'invisible'"
                            >{{ item.sublabel }}</span
                        ></template
                    ></span
                >
            </Button>
        </TableauDeBordSiteFiltreItem>
    </ul>
</template>

<style scoped lang="scss">
.tbd-sites-filtres li:not(:last-child)::after {
    content: "";
    @apply inline-block w-px h-4 mt-1 pl-4 border-r border-gray-400;
}
</style>

<script setup>
import { computed } from "vue";
import { useDashboardStore } from "@/stores/dashboard.store";
import TableauDeBordSiteFiltreItem from "./TableauDeBordSiteFiltre/TableauDeBordSiteFiltreItem.vue";
import { trackEvent } from "@/helpers/matomo";
import { Button } from "@resorptionbidonvilles/ui";

const dashboardStore = useDashboardStore();
const items = computed(() => {
    const rawItems = [
        {
            id: "my_shantytowns",
            type: "link",
            label: "Mes sites",
            track_id: "Mes sites",
        },
        {
            id: "new_shantytowns",
            type: "link",
            label: "Nouveaux sites déclarés",
            sublabel: "Sur les 30 derniers jours",
            track_id: "Nouveaux sites",
        },
        {
            id: "shantytowns_with_target",
            type: "link",
            label: "Objectifs de résorption",
            track_id: "Objectifs de résorption",
        },
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
            ariaSelected: item.id === dashboardStore.towns.filter,
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
