<template>
    <DashboardSection :title="title" size="xl">
        <template slot="body">
            <p class="-mt-5 mb-5">
                <Icon icon="map-marker-alt" class="text-primary" />
                <span class="ml-2">Localisation : {{ locationName }} </span>
            </p>

            <ul class="flex">
                <li class="pr-4">
                    <a class="link" href="#vuedensemble">Vue d'ensemble</a>
                </li>
                <li class="pr-4">
                    <a class="link" href="#sites">Sites</a>
                </li>
                <li>
                    <a class="link" href="#activite">Activité</a>
                </li>
            </ul>
        </template>
    </DashboardSection>
</template>

<script>
import DashboardSection from "../DashboardSection";
import { get as getConfig } from "#helpers/api/config";

export default {
    components: {
        DashboardSection
    },

    data() {
        const { user } = getConfig();

        return {
            user
        };
    },

    computed: {
        title() {
            return `Bienvenue ${this.user.first_name
                .slice(0, 1)
                .toUpperCase()}${this.user.first_name.slice(1).toLowerCase()} ${
                this.user.last_name
            }`;
        },
        locationName() {
            if (this.user.organization.location.type === "nation") {
                return "France";
            }

            return this.user.organization.location[
                this.user.organization.location.type
            ].name;
        }
    }
};
</script>
