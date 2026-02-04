<template>
    <div class="flex justify-between space-x-6">
        <section class="flex space-x-6 flex-1">
            <p>
                <MiniCarte :location="mapLocation" />
            </p>
            <div>
                <h1 class="text-3xl text-info font-bold">{{ title }}</h1>
                <p>
                    {{ currentActionsCount }} action{{ isPlural ? "s" : "" }}
                    <template v-if="actionsStore.filters.status === 'open'"
                        >en cours
                        <template
                            v-if="updatedActionsInTheLastSixMonths !== null"
                        >
                            <DsfrBadge
                                v-if="currentTab !== 'close'"
                                small
                                :type="badgeVariant"
                                :label="badgeLabel"
                                noIcon
                            >
                                dont {{ updatedActionsPercentage }}% d'action{{
                                    updatedActionsInTheLastSixMonths > 1
                                        ? "s"
                                        : ""
                                }}
                                ({{ updatedActionsInTheLastSixMonths }}) mises à
                                jour dans les 6 derniers mois
                            </DsfrBadge>
                        </template>
                    </template>
                    <template v-else
                        >terminée{{ isPlural ? "s" : "" }}
                    </template>
                </p>
            </div>
        </section>
    </div>
</template>

<script setup>
import { toRefs, computed } from "vue";
import { useActionsStore } from "@/stores/actions.store";
import computeLocationSearchTitle from "@/utils/computeLocationSearchTitle";
import MiniCarte from "@/components/MiniCarte/MiniCarte.vue";
import formatStat from "@common/utils/formatStat";
import getSince from "@/utils/getSince";

const actionsStore = useActionsStore();
const { location, search } = toRefs(actionsStore.filters);

const mapLocation = computed(() => {
    return location.value || { typeUid: "nation" };
});
const title = computed(() => {
    return computeLocationSearchTitle(search.value, location.value);
});
const currentActions = computed(() => {
    return actionsStore.filteredActions[actionsStore.filters.status];
});
const currentActionsCount = computed(() => {
    return formatStat(currentActions.value.length);
});
const isPlural = computed(() => {
    return currentActionsCount.value > 1;
});

const updatedActionsInTheLastSixMonths = computed(() => {
    return currentActions.value.filter((action) => {
        // Utiliser getSince pour obtenir les mois écoulés
        const lastUpdate = {
            createdAt: getSince(action.created_at / 1000).months < 6,
            updatedAt: getSince(action.updated_at / 1000).months < 6,
            metricUpdatedAt:
                getSince(action.metrics_updated_at / 1000).months < 6,
        };

        // Un site est considéré comme mis à jour récemment si moins de 6 mois se sont écoulés
        return Object.values(lastUpdate).some((value) => value === true);
    }).length;
});

const updatedActionsPercentage = computed(() => {
    if (currentActionsCount.value === 0) {
        return 0; // Éviter la division par zéro
    }

    const percentage =
        (updatedActionsInTheLastSixMonths.value / currentActionsCount.value) *
        100;

    // Arrondir à 1 décimale
    return Math.round(percentage * 10) / 10;
});

const badgeLabel = computed(() => {
    if (updatedActionsPercentage.value > 0) {
        return `dont ${updatedActionsPercentage.value}% d'action${
            updatedActionsInTheLastSixMonths.value > 1 ? "s" : ""
        } (${
            updatedActionsInTheLastSixMonths.value
        }) mises à jour dans les 6 derniers mois`;
    }
    return "Aucune action mise à jour au cours des 6 derniers mois";
});

const badgeVariant = computed(() => {
    if (updatedActionsPercentage.value >= 80) {
        return "success";
    } else if (updatedActionsPercentage.value >= 60) {
        return "warning";
    } else {
        return "error";
    }
});
</script>
