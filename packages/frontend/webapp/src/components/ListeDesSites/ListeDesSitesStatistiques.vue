<template>
    <div class="flex justify-between space-x-6 print:hidden">
        <section class="flex space-x-6 flex-1">
            <p>
                <MiniCarte :location="mapLocation" />
            </p>
            <div>
                <p class="text-3xl text-info font-bold">{{ title }}</p>
                <p>
                    {{ formatStat(populationTotal) }} personne{{
                        isPlural(populationTotal) ? "s" : ""
                    }}
                </p>
                <p>
                    {{ formatStat(townsStore.filteredTowns.length) }}
                    site{{ isPlural(townsStore.filteredTowns.length) ? "s" : ""
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

const updatedSitesInTheLastSixMonths = computed(() => {
    return townsStore.filteredTowns.filter((town) => {
        if (!town.lastUpdatedAt) {
            return false;
        }

        // Utiliser getSince pour obtenir les mois écoulés
        const { months } = getSince(town.lastUpdatedAt);

        // Un site est considéré comme mis à jour récemment si moins de 6 mois se sont écoulés
        return months < 6;
    }).length;
});

// Pourcentage de sites mis à jour dans les 6 derniers mois
const updatedSitesPercentage = computed(() => {
    const totalSites = townsStore.filteredTowns.length;
    if (totalSites === 0) {
        return 0; // Éviter la division par zéro
    }

    const percentage =
        (updatedSitesInTheLastSixMonths.value / totalSites) * 100;

    // Arrondir à 1 décimale
    return Math.round(percentage * 10) / 10;
});

const badgeLabel = computed(() => {
    if (updatedSitesInTheLastSixMonths.value > 0) {
        return `dont ${updatedSitesPercentage.value}% de site${
            isPlural(updatedSitesInTheLastSixMonths.value) ? "s" : ""
        } (${
            updatedSitesInTheLastSixMonths.value
        }) mis à jour dans les 6 derniers mois`;
    }
    return "Aucun site mis à jour au cours des 6 derniers mois";
});

const badgeVariant = computed(() => {
    if (updatedSitesPercentage.value >= 80) {
        return "success";
    } else if (updatedSitesPercentage.value >= 60) {
        return "warning";
    } else {
        return "error";
    }
});
</script>
