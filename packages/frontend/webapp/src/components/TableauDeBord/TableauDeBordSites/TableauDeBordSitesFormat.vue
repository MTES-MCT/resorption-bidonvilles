<template>
    <TabList :tabs="tabs" :value="display" @input="changeDisplay" />
</template>

<script setup>
import { toRefs } from "vue";
import { TabList } from "@resorptionbidonvilles/ui";
import { useDashboardStore } from "@/stores/dashboard.store";
import { trackEvent } from "@/helpers/matomo";

const props = defineProps({
    tabs: {
        type: Array,
    },
});
const { tabs } = toRefs(props);
const dashboardStore = useDashboardStore();

function changeDisplay(id) {
    if (id === dashboardStore.towns.display) {
        return;
    }

    const { track_id: trackId } = tabs.value.find((tab) => tab.id === id);
    trackEvent("TB", `Vue ${trackId}`);
    dashboardStore.towns.display = id;
}
</script>
