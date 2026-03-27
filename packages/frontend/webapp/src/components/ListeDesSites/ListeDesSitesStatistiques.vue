<template>
    <div class="flex justify-between space-x-6 print:hidden">
        <section class="flex space-x-6 flex-1">
            <p>
                <MiniCarte :location="mapLocation" />
            </p>
            <div>
                <p class="text-3xl text-info font-bold">{{ title }}</p>
                <p>
                    {{ formatStat(townsStore.filteredTowns.length) }}
                    site{{
                        isPlural(townsStore.filteredTowns.length) ? "s" : ""
                    }}
                    représentant {{ formatStat(populationTotal) }} personne{{
                        isPlural(populationTotal) ? "s" : ""
                    }}
                </p>
                <p>
                    {{ updatedPopulationInTheLastThreeMonths }} sites<template
                        v-if="updatedPopulationInTheLastThreeMonths !== null"
                    >
                        <DsfrBadge
                            v-if="currentTab !== 'close'"
                            class="ml-1"
                            small
                            :type="badgePopulationVariant"
                            :label="badgePopulationLabel"
                            noIcon
                        />
                    </template>
                </p>
                <p>
                    {{ updatedSitesInTheLastSixMonths }}
                    site{{ isPlural(updatedSitesInTheLastSixMonths) ? "s" : ""
                    }}<template v-if="updatedSitesInTheLastSixMonths !== null">
                        <DsfrBadge
                            v-if="currentTab !== 'close'"
                            class="ml-1"
                            small
                            :type="badgeVariant"
                            :label="badgeLabel"
                            noIcon
                        />
                    </template>
                </p>
                <p v-if="userStore.hasJusticePermission">
                    {{ formatStat(justiceTotal) }} site{{
                        isPlural(justiceTotal) ? "s" : ""
                    }}
                    avec une procédure judiciaire
                </p>
                <p v-if="userStore.hasJusticePermission">
                    {{ formatStat(administrativeOrderTotal) }} site{{
                        isPlural(administrativeOrderTotal) ? "s" : ""
                    }}
                    avec une procédure administrative
                </p>
                <p v-if="userStore.hasJusticePermission">
                    {{ formatStat(insalubrityOrderTotal) }} site{{
                        isPlural(insalubrityOrderTotal) ? "s" : ""
                    }}
                    avec une opération RHI
                </p>
            </div>
        </section>
    </div>
</template>

<script setup>
import { toRefs, computed } from "vue";
import { useTownsStore } from "@/stores/towns.store";
import { useUserStore } from "@/stores/user.store";
import computeLocationSearchTitle from "@/utils/computeLocationSearchTitle";
import MiniCarte from "@/components/MiniCarte/MiniCarte.vue";
import formatStat from "@common/utils/formatStat";
import getSince from "@/utils/getSince";
import isPlural from "@/utils/isPlural";
import getBadgeLabel from "@/utils/getBadgeLabel";
import getBadgeVariant from "@/utils/getBadgeVariant";

const props = defineProps({
    currentTab: {
        type: String,
    },
});
const townsStore = useTownsStore();
const userStore = useUserStore();
const { location, search } = toRefs(townsStore.filters);
const { currentTab } = toRefs(props);

const mapLocation = computed(() => {
    return location.value || { typeUid: "nation" };
});
const title = computed(() => {
    return computeLocationSearchTitle(search.value, location.value);
});
const populationTotal = computed(() => {
    return townsStore.filteredTowns.reduce(
        (total, { populationTotal }) => total + (populationTotal || 0),
        0
    );
});
const justiceTotal = computed(() => {
    return townsStore.filteredTowns.filter(
        ({ justiceProcedure }) => justiceProcedure === true
    ).length;
});

const administrativeOrderTotal = computed(() => {
    return townsStore.filteredTowns.filter(
        ({ evacuationUnderTimeLimit }) => evacuationUnderTimeLimit === true
    ).length;
});

const insalubrityOrderTotal = computed(() => {
    return townsStore.filteredTowns.filter(
        ({ insalubrityOrder }) => insalubrityOrder === true
    ).length;
});

const countRecentlyUpdatedTowns = (getDate, maxMonths) => {
    return computed(() => {
        return townsStore.filteredTowns.filter((town) => {
            const date = getDate(town);

            if (!date) {
                return false;
            }

            const { months } = getSince(date);
            return months < maxMonths;
        }).length;
    });
};

const computePercentage = (count, total) => {
    if (total === 0) {
        return 0;
    }

    return Math.round((count / total) * 1000) / 10;
};

const totalSites = computed(() => townsStore.filteredTowns.length);

const updatedSitesInTheLastSixMonths = countRecentlyUpdatedTowns(
    ({ lastUpdatedAt }) => lastUpdatedAt,
    6
);

const updatedPopulationInTheLastThreeMonths = countRecentlyUpdatedTowns(
    ({ populationUpdatedAt }) => populationUpdatedAt,
    3
);

// Pourcentage de sites mis à jour dans les 6 derniers mois
const updatedSitesPercentage = computed(() => {
    return computePercentage(
        updatedSitesInTheLastSixMonths.value,
        totalSites.value
    );
});

// Pourcentage de sites dont les habitants ont été mis à jour dans les 3 derniers mois
const updatedPopulationPercentage = computed(() => {
    return computePercentage(
        updatedPopulationInTheLastThreeMonths.value,
        totalSites.value
    );
});

const badgeLabel = computed(() => {
    return getBadgeLabel(
        updatedSitesInTheLastSixMonths.value,
        updatedSitesPercentage.value,
        "mis à jour dans les 6 derniers mois",
        "Aucun site mis à jour au cours des 6 derniers mois"
    );
});

const badgePopulationLabel = computed(() => {
    return getBadgeLabel(
        updatedPopulationInTheLastThreeMonths.value,
        updatedPopulationPercentage.value,
        "dont le nombre d’habitants a été mis à jour dans les 3 derniers mois",
        "Aucun site dont les habitants ont été mis à jour au cours des 3 derniers mois"
    );
});

const badgePopulationVariant = computed(() => {
    return getBadgeVariant(updatedPopulationPercentage.value, 95, 80);
});

const badgeVariant = computed(() => {
    return getBadgeVariant(updatedSitesPercentage.value, 80, 60);
});
</script>
