<template>
    <FicheRubrique title="Procédure judiciaire" category="justice">
        <FicheSiteProceduresJudiciaireLigne
            icon="scroll"
            label="Dépôt de plainte du propriétaire"
            :border="false"
            :marginTop="false"
        >
            {{ formatBool(town.ownerComplaint) }}
        </FicheSiteProceduresJudiciaireLigne>
        <FicheSiteProceduresJudiciaireLigne
            icon="balance-scale"
            label="Existence d’une procédure judiciaire"
        >
            {{ formatBool(town.justiceProcedure) }}
        </FicheSiteProceduresJudiciaireLigne>

        <FicheSiteProceduresJudiciaireLigne label="Décision de justice rendue">
            {{ justiceRendered }}
        </FicheSiteProceduresJudiciaireLigne>

        <FicheSiteProceduresJudiciaireLigne label="Contentieux">
            {{ formatBool(town.justiceChallenged) }}
        </FicheSiteProceduresJudiciaireLigne>

        <FicheSiteProceduresJudiciaireLigne
            icon="person-military-pointing"
            label="Concours de la police publique"
        >
            {{ policeStatus }}
        </FicheSiteProceduresJudiciaireLigne>

        <FicheSiteProceduresJudiciaireLigne
            icon="file"
            label="Nom de l'étude d'huissier"
        >
            {{ town.bailiff || "non communiqué" }}
        </FicheSiteProceduresJudiciaireLigne>
        <ModaleListeAccesPJ
            ref="modaleListeAccesPJ"
            :title="title"
            :location="location"
        />
    </FicheRubrique>
</template>

<script setup>
import { defineProps, ref, toRefs, computed, watch } from "vue";
import formatBool from "@/utils/formatBool";
import formatDate from "@/utils/formatDate";

import { useEventBus } from "@/helpers/event-bus";

import FicheRubrique from "@/components/FicheRubrique/FicheRubrique.vue";
import FicheSiteProceduresJudiciaireLigne from "./FicheSiteProceduresJudiciaireLigne.vue";
import ModaleListeAccesPJ from "@/components/ModaleListeAccesPJ/ModaleListeAccesPJ.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
const { bus } = useEventBus();

const modaleListeAccesPJ = ref(null);
const title = " Qui a accès aux données sur la procédure judiciaire ?";

const justiceRendered = computed(() => {
    if (town.value.justiceRendered === null) {
        return "non communiqué";
    }

    if (town.value.justiceRendered !== true) {
        return "non";
    }

    return `rendue le ${formatDate(town.value.justiceRenderedAt, "d/m/y")}`;
});

const policeStatus = computed(() => {
    if (town.value.policeStatus === "none") {
        return "non demandé";
    }

    if (town.value.policeStatus === "requested") {
        return `demandé le ${formatDate(
            town.value.policeRequestedAt,
            "d/m/y"
        )}`;
    }

    if (town.value.policeStatus === "granted") {
        return `accordé le ${formatDate(town.value.policeGrantedAt, "d/m/y")}`;
    }

    return "non communiqué";
});

const location = computed(() => {
    return {
        type: "city",
        city: town.value.city,
        epci: town.value.epci,
        departement: town.value.departement,
        region: town.value.region,
    };
});

watch(
    () => bus.value.get("fichesitepj:openListAccesPJ"),
    () => {
        modaleListeAccesPJ.value.open();
    }
);
</script>
