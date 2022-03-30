<template>
    <PrivateLayout>
        <DashboardSearchBar @locationChange="onLocationChange" />
        <PrivateContainer class="pt-10 mb-12">
            <DashboardHeader />
            <DashboardGlobalView class="mt-12" />
            <DashboardShantytowns class="mt-12" />
            <DashboardActivities class="mt-12" />
        </PrivateContainer>
    </PrivateLayout>
</template>

<script>
import PrivateLayout from "#app/components/PrivateLayout";
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer";
import DashboardSearchBar from "./DashboardSearchBar.vue";
import DashboardHeader from "./DashboardHeader/DashboardHeader";
import DashboardShantytowns from "./DashboardShantytowns/DashboardShantytowns";
import DashboardActivities from "./DashboardActivities/DashboardActivities";
import DashboardGlobalView from "./DashboardGlobalView/DashboardGlobalView.vue";
import { mapGetters } from "vuex";

export default {
    components: {
        PrivateLayout,
        PrivateContainer,
        DashboardSearchBar,
        DashboardHeader,
        DashboardShantytowns,
        DashboardActivities,
        DashboardGlobalView
    },

    data() {
        const aMonthAgo = new Date();
        aMonthAgo.setDate(aMonthAgo.getDate() - 30);
        aMonthAgo.setHours(0);
        aMonthAgo.setMinutes(0);
        aMonthAgo.setSeconds(0);
        aMonthAgo.setMilliseconds(0);

        return {
            aMonthAgo: aMonthAgo.getTime() / 1000
        };
    },
    computed: {
        ...mapGetters({
            locationFilter: "dashboard/dashboardLocationFilter"
        })
    },

    methods: {
        onLocationChange() {
            this.$store.dispatch("dashboard/fetchGlobalStats");

            this.$store.dispatch("fetchActivities", {
                location: {
                    locationType: this.locationFilter.locationType,
                    locationCode: this.locationFilter.locationCode
                },
                maxDate: this.aMonthAgo * 1000,
                numberOfActivities: -1
            });
        }
    }
};
</script>
