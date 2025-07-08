<template>
    <div class="flex justify-between space-x-6 print:hidden">
        <section class="flex space-x-6 flex-1">
            <p>
                <MiniCarte :location="mapLocation" />
            </p>
            <div>
                <p class="text-3xl text-info font-bold">{{ title }}</p>
                <p>
                    {{ formatStat(populationTotal) }} personne<template
                        v-if="populationTotal > 1"
                        >s</template
                    >
                </p>
                <p>
                    {{ formatStat(townsStore.filteredTowns.length) }}
                    site<template v-if="townsStore.filteredTowns.length > 1"
                        >s</template
                    ><template v-if="updatedSitesInTheLastSixMonths > 0">
                        <DsfrBadge
                            class="ml-1"
                            small
                            :type="badgeVariant"
                            :label="badgeLabel"
                            noIcon
                        >
                            dont {{ updatedSitesPercentage }}% de site{{
                                updatedSitesInTheLastSixMonths > 1 ? "s" : ""
                            }}
                            ({{ updatedSitesInTheLastSixMonths }}) mis à jour
                            dans les 6 derniers mois
                        </DsfrBadge>
                    </template>
                </p>
                <p v-if="userStore.hasJusticePermission">
                    {{ formatStat(justiceTotal) }} site<template
                        v-if="justiceTotal > 1"
                        >s</template
                    >
                    avec une procédure judiciaire
                </p>
                <p v-if="userStore.hasJusticePermission">
                    {{ formatStat(administrativeOrderTotal) }} site<template
                        v-if="administrativeOrderTotal > 1"
                        >s</template
                    >
                    avec une procédure administrative
                </p>
                <p v-if="userStore.hasJusticePermission">
                    {{ formatStat(insalubrityOrderTotal) }} site<template
                        v-if="insalubrityOrderTotal > 1"
                        >s</template
                    >
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

const townsStore = useTownsStore();
const userStore = useUserStore();
const { location, search } = toRefs(townsStore.filters);

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
            updatedSitesInTheLastSixMonths.value > 1 ? "s" : ""
        } (${
            updatedSitesInTheLastSixMonths.value
        }) mis à jour dans les 6 derniers mois`;
    }
    return "";
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
