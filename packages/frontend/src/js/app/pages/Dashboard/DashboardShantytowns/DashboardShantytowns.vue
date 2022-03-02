<template>
    <DashboardSection title="Sites" id="sites">
        <template slot="header_left">
            <DashboardShantytownsFilters />
            <TabList :tabs="tabs" v-model="currentTab" />
        </template>

        <template slot="body">
            <DashboardShantytownsList />
        </template>
    </DashboardSection>
</template>

<script>
import TabList from "#app/components/TabList/TabList.vue";
import DashboardSection from "../DashboardSection";
import DashboardShantytownsFilters from "./DashboardShantytownsFilters";
import DashboardShantytownsList from "./DashboardShantytownsList";

export default {
    components: {
        TabList,
        DashboardSection,
        DashboardShantytownsFilters,
        DashboardShantytownsList
    },
    data() {
        return {
            tabs: [
                { id: "thumbnail", label: "Vignettes" },
                { id: "map", label: "Carte" }
            ],
            currentTab: "thumbnail"
        };
    },
    watch: {
        currentTab() {
            this.$store.commit(
                "setDashboardShantytownsDisplay",
                this.currentTab
            );
        }
    }
};
</script>
