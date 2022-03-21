<template>
    <ul class="list-none ml-4">
        <FilterItem
            v-for="item in items"
            :key="item.id"
            :item="item"
            @click.native="setFilter(item.id)"
            >{{ item.label }} ({{ total[item.id] }})</FilterItem
        >
    </ul>
</template>

<script>
import FilterItem from "./DashboardShantytownsFilterItem";
import { mapGetters } from "vuex";

export default {
    components: {
        FilterItem
    },
    computed: {
        ...mapGetters({
            myShantytowns: "dashboard/dashboardMyShantytowns",
            newShantytowns: "dashboard/dashboardNewShantytowns",
            myTerritory: "dashboard/dashboardMyTerritory",
            currentFilter: "dashboard/dashboardShantytownsFilter"
        }),
        total() {
            return {
                my_shantytowns: this.myShantytowns.length,
                new_shantytowns: this.newShantytowns.length,
                my_territory: this.myTerritory.length
            };
        },
        items() {
            const rawItems = [
                {
                    type: "link",
                    label: "Mes sites",
                    id: "my_shantytowns",
                    track_id: "Mes sites"
                },
                { type: "separator", label: "", id: "separator_1" },
                {
                    type: "link",
                    label: "Nouveaux sites déclarés",
                    id: "new_shantytowns",
                    track_id: "Nouveaux sites"
                },
                { type: "separator", label: "", id: "separator_2" },
                {
                    type: "link",
                    label: "Mon territoire",
                    id: "my_territory",
                    track_id: "Tout le territoire"
                }
            ];

            return rawItems.map(item => {
                return {
                    ...item,
                    active: item.id === this.currentFilter
                };
            });
        }
    },
    methods: {
        setFilter(id) {
            if (!id || id === this.currentFilter) {
                return;
            }

            const { track_id: trackId } = this.items.find(
                item => item.id === id
            );
            this.$trackMatomoEvent("TB", `Sites ${trackId}`);
            this.$store.commit("dashboard/setDashboardShantytownsFilter", id);
        }
    }
};
</script>
