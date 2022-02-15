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
import FilterItem from "../DashboardComponents/DashboardFilterItem";
import { mapGetters } from "vuex";

export default {
    components: {
        FilterItem
    },
    computed: {
        ...mapGetters({
            myShantytowns: "dashboardMyShantytowns",
            newShantytowns: "dashboardNewShantytowns",
            myTerritory: "dashboardMyTerritory",
            currentFilter: "dashboardShantytownsFilter"
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
                    label: "Nouveaux sites",
                    id: "new_shantytowns"
                },
                { type: "separator", label: "", id: "separator_2" },
                { type: "link", label: "Mon territoire", id: "my_territory" }
            ];

            if (this.myShantytowns.length > 0) {
                rawItems.unshift(
                    ...[
                        {
                            type: "link",
                            label: "Mes sites",
                            id: "my_shantytowns"
                        },
                        { type: "separator", label: "", id: "separator_1" }
                    ]
                );
            }

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
            if (!id) {
                return;
            }

            this.$store.commit("setDashboardShantytownsFilter", id);
        }
    }
};
</script>
