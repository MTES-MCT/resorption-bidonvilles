<template>
    <FicheRubrique
        title="Caractéristiques du site"
        category="caracteristics"
        class="pb-14"
    >
        <section class="flex flex-col-reverse xl:flex-row">
            <div class="my-8 xl:w-1/2 md:mr-8">
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
            </div>
        </section>
    </FicheRubrique>
</template>

<script setup>
import { getCadastre } from "@/api/ign.api";
import router from "@/helpers/router";
import { useTownsStore } from "@/stores/towns.store";
import generateSquare from "@/utils/generateSquare";
import { computed, defineProps, onMounted, ref, toRefs } from "vue";

import CartoFicheSite from "@/components/CartoFicheSite/CartoFicheSite.vue";
import FicheRubrique from "@/components/FicheRubrique/FicheRubrique.vue";
import FicheSiteDatesInstallation from "./FicheSiteDatesInstallation.vue";
import FicheSiteGPS from "./FicheSiteGPS.vue";
import FicheSiteInfosAcces from "./FicheSiteInfosAcces.vue";
import FicheSiteProprietaire from "./FicheSiteProprietaire.vue";
import FicheSiteSitesAProximite from "./FicheSiteSitesAProximite.vue";
import FicheSiteTypeDeSite from "./FicheSiteTypeDeSite.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
const cadastre = ref(null);
const cadastreIsLoading = ref(null);

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

async function loadCadastre() {
    if (cadastre.value !== null || cadastreIsLoading.value === true) {
        return;
    }

    cadastreIsLoading.value = true;
    try {
        const response = await getCadastre(
            generateSquare([town.value.longitude, town.value.latitude], 0.06)
        );

        if (
            Number.isInteger(response.totalFeatures) &&
            response.totalFeatures > 0
        ) {
            cadastre.value = response;
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
</script>
