<template>
    <Layout :paddingTop="false">
        <ContentWrapper class="pt-8">
            <TableauDeBord />
        </ContentWrapper>
    </Layout>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import { useDashboardStore } from "@/stores/dashboard.store";
import { useDashboardActivitiesStore } from "@/stores/dashboard.activities.store";
import { ContentWrapper } from "@resorptionbidonvilles/ui";
import Layout from "@/components/Layout/Layout.vue";
import TableauDeBord from "@/components/TableauDeBord/TableauDeBord.vue";

const aMonthAgo = new Date();
aMonthAgo.setDate(aMonthAgo.getDate() - 30);
aMonthAgo.setHours(0);
aMonthAgo.setMinutes(0);
aMonthAgo.setSeconds(0);
aMonthAgo.setMilliseconds(0);

const dashboardStore = useDashboardStore();
const dashboardActivitiesStore = useDashboardActivitiesStore();

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
