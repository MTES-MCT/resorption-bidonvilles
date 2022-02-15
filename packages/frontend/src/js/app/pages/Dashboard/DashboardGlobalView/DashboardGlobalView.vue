<template>
    <div>
        <div class="py-10">
            <span class="font-bold">
                Bienvenue {{ user.first_name }} {{ user.last_name }} <br /><br
            /></span>

            <Icon icon="map-marker-alt" :style="'color: #000091'" />
            <span> Localisation : {{ locationName }} </span>
        </div>

        <DashboardSection title="Vue d'ensemble">
            <template slot="header_left">
                <DashboardGlobalViewFilters />
            </template>

            <template slot="body">
                <DashboardGlobalViewStatsList />
            </template>
        </DashboardSection>
    </div>
</template>

<script>
import DashboardSection from "../DashboardSection";
import DashboardGlobalViewFilters from "./DashboardGlobalViewFilters";
import DashboardGlobalViewStatsList from "./DashboardGlobalViewStatsList";
import { get as getConfig } from "#helpers/api/config";

export default {
    components: {
        DashboardSection,
        DashboardGlobalViewFilters,
        DashboardGlobalViewStatsList
    },
    data() {
        const { user } = getConfig();
        return {
            /**
             * Current user
             *
             * @type {User}
             */
            user,
            stats: [],
            temporality: "month",
            locationType: null,
            locationCode: null,
            locationName: null
        };
    },
    created() {
        this.load();
    },
    methods: {
        async load() {
            if (this.user.organization.location.type === "nation") {
                this.locationName = "France métropolitaine";
            } else {
                this.locationName = this.user.organization.location[
                    this.user.organization.location.type
                ].name;
            }
        }
    }
};
</script>
