<template>
    <DashboardSection title="Sites" id="sites">
        <template slot="header_left">
            <DashboardShantytownsFilters />
            <DashboardShantytownsDisplay :tabs="tabs" />
        </template>

        <template slot="body">
            <DashboardShantytownsList />
        </template>
    </DashboardSection>
</template>

<script>
import DashboardSection from "../DashboardSection";
import DashboardShantytownsFilters from "./DashboardShantytownsFilters";
import DashboardShantytownsList from "./DashboardShantytownsList";
import DashboardShantytownsDisplay from "./DashboardShantytownsDisplay.vue";

export default {
    components: {
        DashboardSection,
        DashboardShantytownsFilters,
        DashboardShantytownsList,
        DashboardShantytownsDisplay
    },
    data() {
        return {
            tabs: [
                { id: "thumbnail", label: "Vignettes" },
                { id: "map", label: "Carte" }
            ]
        };
    }
};
</script>
