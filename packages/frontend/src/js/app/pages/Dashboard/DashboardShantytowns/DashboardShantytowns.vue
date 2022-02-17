<template>
    <DashboardSection title="Sites" id="sites">
        <template slot="header_left">
            <DashboardShantytownsFilters />
            <DashboardShantytownsSorts />
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
import DashboardShantytownsList from "./DashboardShantytownsList";

export default {
    components: {
        DashboardSection,
        DashboardShantytownsFilters,
        DashboardShantytownsSorts,
        DashboardShantytownsList
    }
};
</script>
