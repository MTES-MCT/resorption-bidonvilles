<template>
    <LayoutSearch
        :allowFreeSearch="false"
        searchTitle="Rechercher une commune, un département..."
        searchPlaceholder="Nom d'une commune, d'un département..."
        v-model:location="location"
    >
        <ContentWrapper>
            <FilArianne :items="ariane" class="mb-8" />
        </ContentWrapper>
        <TableauDeBord />
    </LayoutSearch>
</template>

<script setup>
import { onMounted, computed, onBeforeUnmount } from "vue";
import { useDashboardStore } from "@/stores/dashboard.store";
import { useDashboardActivitiesStore } from "@/stores/dashboard.activities.store";
import { ContentWrapper, FilArianne } from "@resorptionbidonvilles/ui";
import LayoutSearch from "@/components/LayoutSearch/LayoutSearch.vue";
import TableauDeBord from "@/components/TableauDeBord/TableauDeBord.vue";

const ariane = [{ label: "Accueil", to: "/" }];
const aMonthAgo = new Date();
aMonthAgo.setDate(aMonthAgo.getDate() - 30);
aMonthAgo.setHours(0);
aMonthAgo.setMinutes(0);
aMonthAgo.setSeconds(0);
aMonthAgo.setMilliseconds(0);

const dashboardStore = useDashboardStore();
const dashboardActivitiesStore = useDashboardActivitiesStore();

const location = computed({
    get() {
        return {
            search: dashboardStore.filters.search,
            data: dashboardStore.filters.location,
        };
    },
    set(newValue) {
        if (!newValue) {
            dashboardStore.filters.search = "";
            dashboardStore.filters.location = null;
        } else {
            dashboardStore.filters.search = newValue?.search;
            dashboardStore.filters.location = newValue?.data;
        }

        fetch();
    },
});

onMounted(() => {
    if (dashboardStore.stats.data.length === 0) {
        fetch();
    }
});

onBeforeUnmount(() => {
    dashboardActivitiesStore.resetPage();
});

function fetch() {
    dashboardStore.fetchStats();
    dashboardActivitiesStore.fetch({
        location: {
            locationType: dashboardStore.filters.location?.typeUid || "nation",
            locationCode: dashboardStore.filters.location?.code,
        },
        maxDate: aMonthAgo.getTime(),
        numberOfActivities: -1,
    });
}
</script>
