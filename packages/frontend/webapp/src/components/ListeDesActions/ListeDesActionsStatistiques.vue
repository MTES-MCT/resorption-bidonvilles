<template>
    <div class="flex justify-between space-x-6">
        <section class="flex space-x-6 flex-1">
            <p>
                <MiniCarte :location="mapLocation" />
            </p>
            <div>
                <h1 class="text-3xl text-info font-bold">{{ title }}</h1>
                <div>
                    <template
                        v-if="actionsStore.filters.status === 'myOrganization'"
                    >
                        <div v-if="myOrgOpenActionsCount > 0">
                            {{ myOrgOpenActionsCount }} action{{
                                isPlural(myOrgOpenActionsCount) ? "s" : ""
                            }}
                            en cours
                            <div>
                                <DsfrBadge
                                    :type="badgeDIHALVariantMyOrg"
                                    :label="badgeDIHALLabelMyOrg"
                                    noIcon
                                    small
                                />
                                des actions financées par la DIHAL ont des
                                indicateurs mis à jour depuis moins de 3 mois
                                ({{
                                    updatedActionsFinancedByDIHALMyOrg
                                }}
                                actions sur {{ actionsFinancedByDIHALMyOrg }})
                            </div>
                            <div>
                                <DsfrBadge
                                    :type="badgeVariantMyOrg"
                                    :label="badgeLabelMyOrg"
                                    noIcon
                                    small
                                />
                                des actions ont des indicateurs mis à jour dans
                                les 6 derniers mois ({{
                                    updatedActionsInTheLastSixMonthsMyOrg
                                }}
                                actions sur {{ myOrgOpenActionsCount }} )
                            </div>
                        </div>
                        <div
                            v-if="myOrgClosedActionsCount > 0"
                            :class="{ 'mt-4': myOrgOpenActionsCount > 0 }"
                        >
                            {{ myOrgClosedActionsCount }} action{{
                                isPlural(myOrgClosedActionsCount) ? "s" : ""
                            }}
                            terminée{{
                                isPlural(myOrgClosedActionsCount) ? "s" : ""
                            }}
                        </div>
                    </template>
                    <template v-else>
                        {{ currentActionsCount }} action{{
                            isPlural(currentActionsCount) ? "s" : ""
                        }}
                        <template v-if="actionsStore.filters.status === 'open'"
                            >en cours
                            <div>
                                <DsfrBadge
                                    :type="badgeDIHALVariant"
                                    :label="badgeDIHALLabel"
                                    noIcon
                                    small
                                />
                                des actions financées par la DIHAL ont des
                                indicateurs mis à jour depuis moins de 3 mois
                                ({{ updatedActionsFinancedByDIHAL }} actions sur
                                {{ actionsFinancedByDIHAL }})
                            </div>
                            <div>
                                <DsfrBadge
                                    :type="badgeVariant"
                                    :label="badgeLabel"
                                    noIcon
                                    small
                                />
                                des actions ont des indicateurs mis à jour dans
                                6 derniers mois ({{
                                    updatedActionsInTheLastSixMonths
                                }}
                                actions sur {{ currentActionsCount }} )
                            </div>
                        </template>
                        <template v-else
                            >terminée{{
                                isPlural(currentActionsCount) ? "s" : ""
                            }}
                        </template>
                    </template>
                </div>
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
import isPlural from "@/utils/isPlural";
import getBadgeLabel from "@/utils/getBadgeLabel";
import getBadgeVariant from "@/utils/getBadgeVariant";

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

const updatedActionsInTheLastSixMonths = computed(() => {
    return currentActions.value.filter((action) => {
        // Utiliser getSince pour obtenir les mois écoulés
        const lastUpdate = {
            metricUpdatedAt:
                getSince(action.metrics_updated_at / 1000).months < 6,
        };

        // Un site est considéré comme mis à jour récemment si moins de 6 mois se sont écoulés
        return lastUpdate.metricUpdatedAt;
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
    return getBadgeLabel(
        updatedActionsInTheLastSixMonths.value,
        updatedActionsPercentage.value,
        false,
        false,
        true
    );
});

const badgeVariant = computed(() => {
    return getBadgeVariant(updatedActionsPercentage.value, 80, 60);
});

const actionsFinancedByDIHAL = computed(() => {
    return currentActions.value.filter((action) => action.hasDihalFinancing)
        .length;
});

const updatedActionsFinancedByDIHAL = computed(() => {
    return currentActions.value.filter(
        (action) =>
            action.hasDihalFinancing &&
            getSince(action.metrics_updated_at / 1000).months < 3
    ).length;
});

const actionFinancedByDIHALPercentage = computed(() => {
    if (actionsFinancedByDIHAL.value === 0) {
        return 0; // Éviter la division par zéro
    }

    const percentage =
        (updatedActionsFinancedByDIHAL.value / actionsFinancedByDIHAL.value) *
        100;

    // Arrondir à 1 décimale
    return Math.round(percentage * 10) / 10;
});

const badgeDIHALLabel = computed(() => {
    return getBadgeLabel(
        actionsFinancedByDIHAL.value,
        actionFinancedByDIHALPercentage.value,
        false,
        false,
        true
    );
});

const badgeDIHALVariant = computed(() => {
    return getBadgeVariant(actionFinancedByDIHALPercentage.value, 95, 80);
});

const myOrgOpenActions = computed(() => {
    if (actionsStore.filters.status !== "myOrganization") {
        return [];
    }
    const now = new Date();
    return currentActions.value.filter(
        (action) => action.ended_at === null || now < action.ended_at
    );
});

const myOrgClosedActions = computed(() => {
    if (actionsStore.filters.status !== "myOrganization") {
        return [];
    }
    const now = new Date();
    return currentActions.value.filter(
        (action) => action.ended_at !== null && now > action.ended_at
    );
});

const myOrgOpenActionsCount = computed(() => {
    return formatStat(myOrgOpenActions.value.length);
});

const myOrgClosedActionsCount = computed(() => {
    return formatStat(myOrgClosedActions.value.length);
});

const updatedActionsInTheLastSixMonthsMyOrg = computed(() => {
    return myOrgOpenActions.value.filter((action) => {
        const lastUpdate = {
            metricUpdatedAt:
                getSince(action.metrics_updated_at / 1000).months < 6,
        };
        return lastUpdate.metricUpdatedAt;
    }).length;
});

const updatedActionsPercentageMyOrg = computed(() => {
    if (myOrgOpenActionsCount.value === 0) {
        return 0;
    }
    const percentage =
        (updatedActionsInTheLastSixMonthsMyOrg.value /
            myOrgOpenActions.value.length) *
        100;
    return Math.round(percentage * 10) / 10;
});

const badgeLabelMyOrg = computed(() => {
    return getBadgeLabel(
        updatedActionsInTheLastSixMonthsMyOrg.value,
        updatedActionsPercentageMyOrg.value,
        false,
        false,
        true
    );
});

const badgeVariantMyOrg = computed(() => {
    return getBadgeVariant(updatedActionsPercentageMyOrg.value, 80, 60);
});

const actionsFinancedByDIHALMyOrg = computed(() => {
    return myOrgOpenActions.value.filter((action) => action.hasDihalFinancing)
        .length;
});

const updatedActionsFinancedByDIHALMyOrg = computed(() => {
    return myOrgOpenActions.value.filter(
        (action) =>
            action.hasDihalFinancing &&
            getSince(action.metrics_updated_at / 1000).months < 3
    ).length;
});

const actionFinancedByDIHALPercentageMyOrg = computed(() => {
    if (actionsFinancedByDIHALMyOrg.value === 0) {
        return 0;
    }
    const percentage =
        (updatedActionsFinancedByDIHALMyOrg.value /
            actionsFinancedByDIHALMyOrg.value) *
        100;
    return Math.round(percentage * 10) / 10;
});

const badgeDIHALLabelMyOrg = computed(() => {
    return getBadgeLabel(
        actionsFinancedByDIHALMyOrg.value,
        actionFinancedByDIHALPercentageMyOrg.value,
        false,
        false,
        true
    );
});

const badgeDIHALVariantMyOrg = computed(() => {
    return getBadgeVariant(actionFinancedByDIHALPercentageMyOrg.value, 95, 80);
});
</script>
