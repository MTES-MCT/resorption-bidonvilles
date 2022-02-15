<template>
    <ul class="list-none ml-4">
        <FilterItem
            v-for="item in items"
            :key="item.id"
            :item="item"
            @click.native="setFilter(item.id)"
            >{{ item.label }}</FilterItem
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
            currentFilter: "dashboardGlobalStatsFilter"
        }),
        items() {
            const rawItems = [
                {
                    type: "link",
                    label: "Les 4 dernières semaines",
                    id: "month"
                },
                { type: "separator", label: "", id: "separator_2" },
                { type: "link", label: "Les 3 derniers mois", id: "trimestre" }
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
            if (!id) {
                return;
            }

            this.$store.commit("setDashboardGlobalStatsFilter", id);
        }
    }
};
</script>
