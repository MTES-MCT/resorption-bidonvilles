<template>
    <DashboardSection title="Sites" id="sites">
        <template slot="header_left">
            <DashboardShantytownsFilters />
            <TabList :tabs="tabs" :value="display" @input="changeDisplay" />
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
import { mapGetters } from "vuex";

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
            ]
        };
    },
    methods: {
        changeDisplay(id) {
            this.$store.commit("setDashboardShantytownsDisplay", id);
        }
    },
    computed: {
        ...mapGetters({
            display: "dashboardShantytownsDisplay"
        })
    }
};
</script>
