<template>
    <TableauDeBordSection :title="title">
        <p class="-mt-5 mb-5">
            <Icon icon="map-marker-alt" class="text-primary" />
            <span class="ml-2"
                >Localisation : {{ dashboardStore.currentLocationName }}
            </span>
            <span v-if="dashboardStore.currentLocationName === 'France'">
                (métropolitaine et ultramarine)
            </span>
        </p>

        <nav role="navigation" aria-label="Menu du tableau de bord">
            <ul class="flex">
                <li class="pr-4" v-for="link in links" :key="link.id">
                    <Link :to="`#${link.id}`">{{ link.label }}</Link>
                </li>
            </ul>
        </nav>
    </TableauDeBordSection>
</template>

<script setup>
import { computed } from "vue";
import { useUserStore } from "@/stores/user.store.js";
import { useDashboardStore } from "@/stores/dashboard.store.js";

import { Icon, Link } from "@resorptionbidonvilles/ui";
import TableauDeBordSection from "./TableauDeBordSection.vue";

const links = [
    { id: "vue_ensemble", label: "Vue d'ensemble" },
    { id: "sites", label: "Sites" },
    { id: "activites", label: "Activité" },
];
const userStore = useUserStore();
const dashboardStore = useDashboardStore();

const title = computed(() => {
    if (!userStore.user) {
        return "...";
    }

    const { first_name, last_name } = userStore.user;
    return `Bienvenue ${first_name.slice(0, 1).toUpperCase()}${first_name
        .slice(1)
        .toLowerCase()} ${last_name}`;
});
</script>
