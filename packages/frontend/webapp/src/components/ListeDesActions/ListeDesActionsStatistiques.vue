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
                        <div>
                            {{ formatActionsCountLabel(myOrgOpenActionsCount) }}
                            en cours
                            <div v-if="statisticsMyOrg.dihal.total > 0">
                                <DsfrBadge
                                    :type="badgeDIHALVariantMyOrg"
                                    :label="badgeDIHALLabelMyOrg"
                                    noIcon
                                    small
                                />
                                des actions actives en {{ previousYear }},
                                financées par la DIHAL ont des indicateurs mis à
                                jour depuis moins de 3 mois ({{
                                    statisticsMyOrg.dihal.updated
                                }}
                                actions sur
                                {{ statisticsMyOrg.dihal.total }} actives en
                                {{ previousYear }})
                            </div>
                            <div v-if="statisticsMyOrg.sixMonths.total > 0">
                                <DsfrBadge
                                    :type="badgeVariantMyOrg"
                                    :label="badgeLabelMyOrg"
                                    noIcon
                                    small
                                />
                                des actions actives en {{ previousYear }} ont
                                des indicateurs mis à jour dans les 6 derniers
                                mois ({{ statisticsMyOrg.sixMonths.updated }}
                                actions sur
                                {{ statisticsMyOrg.sixMonths.total }} actives en
                                {{ previousYear }})
                            </div>
                        </div>
                        <div v-if="myOrgClosedActionsCount > 0" class="mt-4">
                            {{ myOrgClosedActionsCount }} action{{
                                isPlural(myOrgClosedActionsCount) ? "s" : ""
                            }}
                            terminée{{
                                isPlural(myOrgClosedActionsCount) ? "s" : ""
                            }}
                        </div>
                    </template>
                    <template v-else>
                        {{ formatActionsCountLabel(currentActionsCount) }}
                        <template v-if="actionsStore.filters.status === 'open'"
                            >en cours
                            <div v-if="statistics.dihal.total > 0">
                                <DsfrBadge
                                    :type="badgeDIHALVariant"
                                    :label="badgeDIHALLabel"
                                    noIcon
                                    small
                                />
                                des actions actives en {{ previousYear }},
                                financées par la DIHAL ont des indicateurs mis à
                                jour depuis moins de 3 mois ({{
                                    statistics.dihal.updated
                                }}
                                actions sur {{ statistics.dihal.total }} actives
                                en {{ previousYear }})
                            </div>
                            <div v-if="statistics.sixMonths.total > 0">
                                <DsfrBadge
                                    :type="badgeVariant"
                                    :label="badgeLabel"
                                    noIcon
                                    small
                                />
                                des actions actives en {{ previousYear }} ont
                                des indicateurs mis à jour dans les 6 derniers
                                mois ({{ statistics.sixMonths.updated }} actions
                                sur {{ statistics.sixMonths.total }} actives en
                                {{ previousYear }})
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
import computeIndicatorsStatistics from "@/utils/computeIndicatorsStatistics";
import MiniCarte from "@/components/MiniCarte/MiniCarte.vue";
import formatStat from "@common/utils/formatStat";
import isPlural from "@/utils/isPlural";
import getBadgeLabel from "@/utils/getBadgeLabel";
import getBadgeVariant from "@/utils/getBadgeVariant";

const actionsStore = useActionsStore();
const { location, search } = toRefs(actionsStore.filters);

const previousYear = new Date().getFullYear() - 1;

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

const formatActionsCountLabel = (count) => {
    if (count <= 0) {
        return "Pas d'action";
    }

    return `${count} action${isPlural(count) ? "s" : ""}`;
};

const statistics = computed(() => {
    return computeIndicatorsStatistics(currentActions.value);
});

const badgeLabel = computed(() => {
    return getBadgeLabel(
        statistics.value.sixMonths.total,
        statistics.value.sixMonths.percentage,
        false,
        false,
        true
    );
});

const badgeVariant = computed(() => {
    return getBadgeVariant(statistics.value.sixMonths.percentage, 80, 60);
});

const badgeDIHALLabel = computed(() => {
    return getBadgeLabel(
        statistics.value.dihal.total,
        statistics.value.dihal.percentage,
        false,
        false,
        true
    );
});

const badgeDIHALVariant = computed(() => {
    return getBadgeVariant(statistics.value.dihal.percentage, 95, 80);
});

const myOrgOpenActions = computed(() => {
    if (actionsStore.filters.status !== "myOrganization") {
        return [];
    }
    // Le store ne renvoie que les actions en cours pour `myOrganization`.
    return currentActions.value;
});

const myOrgOpenActionsCount = computed(() => {
    return formatStat(myOrgOpenActions.value.length);
});

const myOrgClosedActionsCount = computed(() => {
    return formatStat(actionsStore.myOrganizationClosedActions.length);
});

const statisticsMyOrg = computed(() => {
    return computeIndicatorsStatistics(myOrgOpenActions.value);
});

const badgeLabelMyOrg = computed(() => {
    return getBadgeLabel(
        statisticsMyOrg.value.sixMonths.total,
        statisticsMyOrg.value.sixMonths.percentage,
        false,
        false,
        true
    );
});

const badgeVariantMyOrg = computed(() => {
    return getBadgeVariant(statisticsMyOrg.value.sixMonths.percentage, 80, 60);
});

const badgeDIHALLabelMyOrg = computed(() => {
    return getBadgeLabel(
        statisticsMyOrg.value.dihal.total,
        statisticsMyOrg.value.dihal.percentage,
        false,
        false,
        true
    );
});

const badgeDIHALVariantMyOrg = computed(() => {
    return getBadgeVariant(statisticsMyOrg.value.dihal.percentage, 95, 80);
});
</script>
