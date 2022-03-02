<template>
    <DashboardSection title="Sites" id="sites">
        <template slot="header_left">
            <DashboardShantytownsFilters />
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

export default {
    components: {
        DashboardSection,
        DashboardShantytownsFilters,
        DashboardShantytownsList
    }
};
</script>
