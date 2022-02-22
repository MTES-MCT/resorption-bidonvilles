<template>
    <DashboardSection title="Sites" id="sites">
        <template slot="header_left">
            <DashboardShantytownsFilters />
            <DashboardShantytownsSorts />
            <DashboardShantytownsDisplay />
        </template>

        <template slot="body">
            <DashboardShantytownsList />
        </template>
    </DashboardSection>
</template>

<script>
import DashboardSection from "../DashboardSection";
import DashboardShantytownsFilters from "./DashboardShantytownsFilters";
import DashboardShantytownsSorts from "./DashboardShantytownsSorts";
import DashboardShantytownsDisplay from "./DashboardShantytownsDisplay";
import DashboardShantytownsList from "./DashboardShantytownsList";

export default {
    components: {
        DashboardSection,
        DashboardShantytownsFilters,
        DashboardShantytownsSorts,
        DashboardShantytownsDisplay,
        DashboardShantytownsList
    }
};
</script>
