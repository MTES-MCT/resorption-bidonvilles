<template>
    <ul class="list-none ml-4">
        <FilterItem
            v-for="item in items"
            :key="item.id"
            :item="item"
            @click.native="setFilter(item.id)"
            >{{ item.label }} ({{ total[item.id] }})
            <template v-if="item.sublabel"
                ><br /><span
                    class="inline-block w-full font-normal text-center"
                    :class="item.active ? 'visible' : 'invisible'"
                    >{{ item.sublabel }}</span
                ></template
            >
        </FilterItem>
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
            shantytownsWithTarget: "dashboard/dashboardShantytownsWithTarget",
            myTerritory: "dashboard/dashboardMyTerritory",
            currentFilter: "dashboard/dashboardShantytownsFilter",
            locationFilter: "dashboard/dashboardLocationFilter"
        }),
        total() {
            return {
                my_shantytowns: this.myShantytowns.length,
                new_shantytowns: this.newShantytowns.length,
                shantytowns_with_target: this.shantytownsWithTarget.length,
                my_territory: this.myTerritory.length
            };
        },
        isUserLocation() {
            // on test si la location filtrée par la barre de recherche est identique au territoire d'intervention
            switch (this.locationFilter.locationType) {
                case "nation":
                    return (
                        this.$store.state.config.configuration.user.organization
                            .location.type === "nation"
                    );
                default:
                    return (
                        this.locationFilter.locationType ===
                            this.$store.state.config.configuration.user
                                .organization.location.type &&
                        this.locationFilter.locationCode ===
                            this.$store.state.config.configuration.user
                                .organization.location[
                                this.$store.state.config.configuration.user
                                    .organization.location.type
                            ].code
                    );
            }
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
                    sublabel: "Sur les 30 derniers jours",
                    id: "new_shantytowns",
                    track_id: "Nouveaux sites"
                },
                { type: "separator", label: "", id: "separator_2" },
                {
                    type: "link",
                    label: "Objectifs de résorption",
                    id: "shantytowns_with_target",
                    track_id: "Objectifs de résorption"
                },
                { type: "separator", label: "", id: "separator_3" },
                {
                    type: "link",
                    label: this.isUserLocation
                        ? "Mon territoire"
                        : this.locationFilter.locationName,
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
