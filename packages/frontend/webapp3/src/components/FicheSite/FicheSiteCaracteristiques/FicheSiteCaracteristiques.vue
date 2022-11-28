<template>
    <FicheRubrique title="Caractéristiques du site">
        <FicheSiteDatesInstallation :town="town" />
        <FicheSiteTypeDeSite :town="town" />
        <FicheSiteInfosAcces v-if="town.addressDetails" :town="town" />
        <FicheSiteGPS :town="town" />
        <FicheSiteProprietaire :town="town" />
        <FicheSiteSitesAProximite
            v-if="town.nearbyTowns?.length > 0"
            :towns="town.nearbyTowns"
        />
    </FicheRubrique>
</template>

<script setup>
import { defineProps, toRefs, onMounted } from "vue";
import { useTownsStore } from "@/stores/towns.store";

import FicheRubrique from "@/components/FicheRubrique/FicheRubrique.vue";
import FicheSiteDatesInstallation from "./FicheSiteDatesInstallation.vue";
import FicheSiteTypeDeSite from "./FicheSiteTypeDeSite.vue";
import FicheSiteInfosAcces from "./FicheSiteInfosAcces.vue";
import FicheSiteGPS from "./FicheSiteGPS.vue";
import FicheSiteProprietaire from "./FicheSiteProprietaire.vue";
import FicheSiteSitesAProximite from "./FicheSiteSitesAProximite.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);

onMounted(() => {
    const townsStore = useTownsStore();
    townsStore.fetchNearbyTowns(town.value.id);
});
</script>
