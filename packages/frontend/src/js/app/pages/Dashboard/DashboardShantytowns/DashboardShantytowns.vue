<template>
    <DashboardSection title="Sites" id="sites">
        <template slot="header_left">
            <DashboardShantytownsFilters />
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
import DashboardShantytownsDisplay from "./DashboardShantytownsDisplay";
import DashboardShantytownsList from "./DashboardShantytownsList";

export default {
    components: {
        DashboardSection,
        DashboardShantytownsFilters,
        DashboardShantytownsDisplay,
        DashboardShantytownsList
    }
};
</script>
