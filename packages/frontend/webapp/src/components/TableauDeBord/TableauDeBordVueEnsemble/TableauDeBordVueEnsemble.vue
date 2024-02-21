<template>
    <TableauDeBordSection title="Vue d'ensemble" id="vue_ensemble">
        <Spinner v-if="dashboardStore.stats.isLoading !== false" />

        <ViewErrorInline v-else-if="dashboardStore.stats.error">
            <template v-slot:title>Statistiques indisponibles</template>
            <template v-slot:code>{{ dashboardStore.stats.error }}</template>
            <template v-slot:content
                >Une erreur est survenue lors de la collecte des données. Vous
                pouvez essayer de rafraîchir la page ou réessayer un peu plus
                tard.</template
            >
            <template v-slot:actions>
                <Button
                    type="button"
                    icon="rotate-right"
                    iconPosition="left"
                    @click="retry"
                    >Réessayer</Button
                >
                <ButtonContact />
            </template>
        </ViewErrorInline>

        <p
            v-else-if="dashboardStore.stats.data.length === 0"
            class="mt-6 text-G600 italic"
        >
            Aucune donnée à afficher
        </p>

        <section v-else>
            <div class="flex flex-wrap gap-5">
                <TableauDeBordCarteStatistique
                    v-for="stat in dashboardStore.stats.data"
                    :key="stat.label"
                    :icon="stat.icon"
                    :cardStats="stat"
                >
                </TableauDeBordCarteStatistique>
            </div>
            <p class="text-center mt-6">
                <Link
                    to="/visualisation-donnees"
                    v-if="userStore.hasPermission('stats.read')"
                >
                    Visualiser toutes les données
                </Link>
            </p>
        </section>
    </TableauDeBordSection>
</template>

<script setup>
import { useUserStore } from "@/stores/user.store";
import { useDashboardStore } from "@/stores/dashboard.store";

import { Button, Link, Spinner } from "@resorptionbidonvilles/ui";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";
import TableauDeBordSection from "../TableauDeBordSection.vue";
import TableauDeBordCarteStatistique from "./TableauDeBordCarteStatistique.vue";
import ViewErrorInline from "@/components/ViewErrorInline/ViewErrorInline.vue";

const dashboardStore = useDashboardStore();
const userStore = useUserStore();

function retry() {
    dashboardStore.fetchStats();
}
</script>
