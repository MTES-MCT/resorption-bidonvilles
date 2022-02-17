<template>
    <DashboardSection title="Vue d'ensemble" id="vuedensemble">
        <template slot="header_left">
            <DashboardGlobalViewFilters />
        </template>

        <template slot="body">
            <DashboardGlobalViewStatsList />
        </template>
    </DashboardSection>
</template>

<script>
import DashboardSection from "../DashboardSection";
import DashboardGlobalViewFilters from "./DashboardGlobalViewFilters";
import DashboardGlobalViewStatsList from "./DashboardGlobalViewStatsList";

export default {
    components: {
        DashboardSection,
        DashboardGlobalViewFilters,
        DashboardGlobalViewStatsList
    }
};
</script>
