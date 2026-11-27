<template>
    <div>
        <section class="fr-grid-row" :aria-labelledby="titleId">
            <div class="fr-mr-3w">
                <MiniCarte :location="mapLocation" />
            </div>
            <div class="fr-col">
                <h2
                    :id="titleId"
                    class="fr-h3 fr-mb-0 fr-text-title--blue-france"
                >
                    {{ title }}
                </h2>
                <div>
                    <template
                        v-if="actionsStore.filters.status === 'myOrganization'"
                    >
                        <div>
                            {{ formatActionsCountLabel(currentActionsCount) }}
                            en cours
                            <ListeDesActionsIndicateursAJour
                                :statistics="statistics"
                                :badges="badges"
                                :previousYear="previousYear"
                            />
                        </div>
                        <div
                            v-if="myOrgClosedActionsCount > 0"
                            class="fr-mt-2w"
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
                        {{ formatActionsCountLabel(currentActionsCount) }}
                        <template v-if="actionsStore.filters.status === 'open'">
                            en cours
                            <ListeDesActionsIndicateursAJour
                                :statistics="statistics"
                                :badges="badges"
                                :previousYear="previousYear"
                            />
                        </template>
                        <template v-else>
                            terminée{{
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
import computeIndicatorsBadges from "@/utils/computeIndicatorsBadges";
import MiniCarte from "@/components/MiniCarte/MiniCarte.vue";
import ListeDesActionsIndicateursAJour from "@/components/ListeDesActions/ListeDesActionsIndicateursAJour.vue";
import formatStat from "@common/utils/formatStat";
import isPlural from "@/utils/isPlural";

const titleId = "liste-des-actions-statistiques-titre";

const actionsStore = useActionsStore();
const { location, search } = toRefs(actionsStore.filters);

const previousYear = new Date().getFullYear() - 1;

const mapLocation = computed(function computeMapLocation() {
    return location.value || { typeUid: "nation" };
});
const title = computed(function computeTitle() {
    return computeLocationSearchTitle(search.value, location.value);
});
// Pour l'onglet `myOrganization`, le store ne renvoie que les actions en cours.
const currentActions = computed(function computeCurrentActions() {
    return actionsStore.filteredActions[actionsStore.filters.status];
});
const currentActionsCount = computed(function computeCurrentActionsCount() {
    return formatStat(currentActions.value.length);
});

function formatActionsCountLabel(count) {
    if (count <= 0) {
        return "Pas d'action";
    }

    return `${count} action${isPlural(count) ? "s" : ""}`;
}

const statistics = computed(function computeStatistics() {
    return computeIndicatorsStatistics(currentActions.value);
});

const badges = computed(function computeBadges() {
    return computeIndicatorsBadges(statistics.value);
});

const myOrgClosedActionsCount = computed(
    function computeMyOrgClosedActionsCount() {
        return formatStat(actionsStore.myOrganizationClosedActions.length);
    }
);
</script>
