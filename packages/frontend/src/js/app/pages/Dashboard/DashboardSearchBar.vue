<template>
    <div class="bg-G100 py-6">
        <h1 class="text-display-md text-center">
            Rechercher une commune, un département... ?
        </h1>

        <GeoSearchbar
            class="mt-4"
            :allowShowAll="false"
            :allowEraseSearch="true"
            :value="locationFilter"
            :disabled="false"
            placeholder="Nom d'une commune, département..."
            @blur="handleSearchBlur"
        ></GeoSearchbar>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

import GeoSearchbar from "#app/components/GeoSearchbar/GeoSearchbar.vue";

export default {
    data() {
        return {
            userLocation: {
                locationType: this.$store.state.config.configuration.user
                    .organization.location.type,
                code:
                    this.$store.state.config.configuration.user.organization
                        .location.type === "nation"
                        ? null
                        : this.$store.state.config.configuration.user
                              .organization.location[
                              this.$store.state.config.configuration.user
                                  .organization.location.type
                          ].code,
                label:
                    this.$store.state.config.configuration.user.organization
                        .location.type === "nation"
                        ? "France"
                        : this.$store.state.config.configuration.user
                              .organization.location[
                              this.$store.state.config.configuration.user
                                  .organization.location.type
                          ].name
            }
        };
    },

    components: {
        GeoSearchbar
    },
    created() {
        this.$store.commit(
            "dashboard/setDashboardLocationFilter",
            this.userLocation
        );
    },
    methods: {
        handleSearchBlur(data) {
            if (data.value) {
                this.$store.commit(
                    "dashboard/setDashboardLocationFilter",
                    data.value
                );
            } else {
                this.$store.commit(
                    "dashboard/setDashboardLocationFilter",
                    this.userLocation
                );
            }

            this.$emit("locationChange");
        }
    },
    computed: {
        ...mapGetters({
            locationFilter: "dashboard/dashboardLocationFilter"
        })
    }
};
</script>
