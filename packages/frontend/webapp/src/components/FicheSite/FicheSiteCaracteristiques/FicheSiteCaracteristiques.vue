<template>
    <FicheRubrique
        title="Caractéristiques du site"
        category="caracteristics"
        :class="[
            'pb-0',
            hasAccessToLandRegistryOwners ? 'xl:pb-32' : 'xl:pb-14',
        ]"
    >
        <section class="flex flex-col-reverse xl:flex-row">
            <div
                :class="[
                    'xl:w-1/2',
                    'md:mr-8',
                    'mb-6',
                    hasAccessToLandRegistryOwners
                        ? 'mt-24 md:mb-6 xl:mt-32 xl:mb-4'
                        : 'xl:mt-8',
                ]"
            >
                <FicheSiteDatesInstallation :town="town" />
                <FicheSiteTypeDeSite :town="town" />
                <FicheSiteInfosAcces v-if="town.addressDetails" :town="town" />
                <FicheSiteGPS :town="town" />
                <FicheSiteProprietaire :town="town" />
                <FicheSiteSitesAProximite
                    v-if="town.nearbyTowns?.length > 0"
                    :towns="town.nearbyTowns"
                />
            </div>
            <div class="h-80 xl:h-auto xl:w-1/2">
                <CartoFicheSite
                    :towns="[
                        town,
                        ...(town.nearbyTowns || []).map((t) => ({
                            ...t,
                            opacity: 0.6,
                        })),
                    ]"
                    :defaultView="mapCenter"
                    :cadastre="cadastre"
                    @townclick="onTownClick"
                />
                <div v-if="hasAccessToLandRegistryOwners">
                    <Button class="mt-12" @click="showModal">
                        Connaître le propriétaire
                    </Button>
                </div>
            </div>
        </section>
    </FicheRubrique>
</template>

<script setup>
import { getCadastre } from "@/api/ign.api";
import { getMajicYear } from "@/api/majic.api";
import router from "@/helpers/router";
import { useTownsStore } from "@/stores/towns.store";
import generateSquare from "@/utils/generateSquare";
import { computed, defineProps, onMounted, ref, toRefs, watch } from "vue";
import { Button } from "@resorptionbidonvilles/ui";

import CartoFicheSite from "@/components/CartoFicheSite/CartoFicheSite.vue";
import FicheRubrique from "@/components/FicheRubrique/FicheRubrique.vue";
import FicheSiteDatesInstallation from "./FicheSiteDatesInstallation.vue";
import FicheSiteGPS from "./FicheSiteGPS.vue";
import FicheSiteInfosAcces from "./FicheSiteInfosAcces.vue";
import FicheSiteProprietaire from "./FicheSiteProprietaire.vue";
import FicheSiteSitesAProximite from "./FicheSiteSitesAProximite.vue";
import FicheSiteTypeDeSite from "./FicheSiteTypeDeSite.vue";
import ModaleConnaitreProprietaire from "@/components/ModaleConnaitreProprietaire/ModaleConnaitreProprietaire.vue";
import { useModaleStore } from "@/stores/modale.store";
import { useUserStore } from "@/stores/user.store";
import { useNotificationStore } from "@/stores/notification.store";

import { trackEvent } from "@/helpers/matomo";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
const cadastre = ref(null);
const cadastreIsLoading = ref(null);
const mainParcel = ref(null);
const hasAccessToLandRegistryOwners = ref(null);
const userStore = useUserStore();

onMounted(() => {
    const townsStore = useTownsStore();
    townsStore.fetchNearbyTowns(town.value.id);

    loadCadastre();
});

const mapCenter = computed(() => {
    return {
        center: [town.value.latitude, town.value.longitude],
        zoom: 15,
    };
});

function getMainSiteParcel(point, features) {
    let foundParcel = null;
    for (const feature of features) {
        if (isPointInPolygon(point, feature.geometry.coordinates)) {
            foundParcel = feature;
            break;
        }
    }
    return foundParcel;
}

function isPointInPolygon(point, polygon) {
    // Implementation de l'algorithme "ray-casting" pour déterminer si un point est à l'intérieur d'un polygone
    let inside = false;

    // Pour les parcelles multi-polygones, on teste chaque polygone
    for (const polyCoords of polygon) {
        for (const ring of polyCoords) {
            for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
                const xi = ring[i][0];
                const yi = ring[i][1];
                const xj = ring[j][0];
                const yj = ring[j][1];

                const intersect =
                    yi > point[1] !== yj > point[1] &&
                    point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi;
                if (intersect) {
                    inside = !inside;
                }
            }
        }
    }
    return inside;
}

async function loadCadastre() {
    if (cadastre.value !== null || cadastreIsLoading.value === true) {
        return;
    }

    cadastreIsLoading.value = true;
    try {
        trackEvent("Site", "Affichage couche cadastre", `S${town.value.id}`);
        const response = await getCadastre(
            generateSquare([town.value.longitude, town.value.latitude], 0.06)
        );

        if (
            Number.isInteger(response.totalFeatures) &&
            response.totalFeatures > 0
        ) {
            cadastre.value = response;
        }

        // On récupère les infos de la parcelle cadastrale principale
        const mainSiteParcel = getMainSiteParcel(
            [town.value.longitude, town.value.latitude],
            response.features
        );

        if (mainSiteParcel) {
            mainParcel.value =
                mainSiteParcel.properties.code_insee +
                "000" +
                mainSiteParcel.properties.section +
                mainSiteParcel.properties.numero;
        }
    } catch (error) {
        // ignore
    }

    cadastreIsLoading.value = false;
}

function onTownClick(clickedTown) {
    if (clickedTown.id === town.value.id) {
        return;
    }

    router.push(`/site/${clickedTown.id}`);
}

async function showModal() {
    if (!mainParcel.value || !hasAccessToLandRegistryOwners.value) {
        return;
    }
    const modaleStore = useModaleStore();
    const notificationStore = useNotificationStore();
    try {
        const dataYear = await getMajicYear(town.value.departement.code);
        modaleStore.open(ModaleConnaitreProprietaire, {
            parcel: mainParcel.value,
            departement: town.value.departement.code,
            dataYear,
            hasAccessToLandRegistryOwners: hasAccessToLandRegistryOwners.value,
        });
    } catch (error) {
        notificationStore.error(
            "Une erreur est survenue",
            error?.user_message ||
                `Erreur lors de la recherche du millésime des donénes foncières.`
        );
    }
}

watch(
    () => mainParcel.value,
    (newValue) => {
        if (
            userStore.hasLocalizedPermission(
                "land_registry.access",
                town.value
            ) &&
            town.value.status === "open"
        ) {
            hasAccessToLandRegistryOwners.value = !!newValue;
        }
    }
);
</script>
