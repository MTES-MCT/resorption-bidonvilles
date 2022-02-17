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
import { get as getConfig } from "#helpers/api/config";

export default {
    components: {
        DashboardSection
    },

    data() {
        const { user } = getConfig();

        return {
            user,
            links: []
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
