<template>
    <DashboardSection :title="title">
        <template slot="body">
            <p class="-mt-5 mb-5">
                <Icon icon="map-marker-alt" class="text-primary" />
                <span class="ml-2">Localisation : {{ locationName }} </span>
            </p>

            <ul class="flex">
                <li class="pr-4" v-for="link in links" :key="link.id">
                    <a class="link" :href="`#${link.id}`">{{ link.label }}</a>
                </li>
            </ul>
        </template>
    </DashboardSection>
</template>

<script>
import DashboardSection from "../DashboardSection";
import { mapGetters } from "vuex";

export default {
    components: {
        DashboardSection
    },

    data() {
        return {
            links: [
                { id: "global_view", label: "Vue d'ensemble" },
                { id: "sites", label: "Sites" },
                { id: "activite", label: "Activité" }
            ]
        };
    },

    computed: {
        ...mapGetters({
            locationFilter: "dashboard/dashboardLocationFilter"
        }),
        user() {
            return this.$store.state.config.configuration.user;
        },
        title() {
            return `Bienvenue ${this.user.first_name
                .slice(0, 1)
                .toUpperCase()}${this.user.first_name.slice(1).toLowerCase()} ${
                this.user.last_name
            }`;
        },
        locationName() {
            return this.locationFilter.locationName;
        }
    }
};
</script>
