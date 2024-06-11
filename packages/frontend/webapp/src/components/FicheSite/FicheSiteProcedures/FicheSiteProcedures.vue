<template>
    <FicheRubrique
        title="Procédure judiciaire ou administrative"
        category="procedure"
    >
        <FicheSiteProceduresRubrique>
            <FicheSiteProceduresLigne
                v-for="(procedure, index) in filteredProcedureJudiciaire"
                :key="index"
                :icon="procedure.icon"
                :label="procedure.label"
                :border="procedure.border || null"
            >
                {{ procedure.value }}
            </FicheSiteProceduresLigne>
        </FicheSiteProceduresRubrique>

        <FicheSiteProceduresRubrique>
            <FicheSiteProceduresLigne
                :border="false"
                icon="file-contract"
                :label="labels.evacuation_under_time_limit"
            >
                <p>{{ administrativeOrderStatus }}</p>
                <p
                    v-if="
                        town.evacuationUnderTimeLimit &&
                        town.administrativeOrderDecisionRenderedBy
                    "
                >
                    Par : {{ town.administrativeOrderDecisionRenderedBy }}
                </p>
            </FicheSiteProceduresLigne>
        </FicheSiteProceduresRubrique>

        <FicheSiteProceduresRubrique>
            <FicheSiteProceduresLigne
                :border="false"
                icon="right-from-bracket"
                :label="labels.insalubrity_order"
            >
                <p>{{ town.insalubrityOrder ? "Oui" : "" }}</p>
                <p>{{ insalubrityOrderStatus }}</p>
                <p
                    v-if="
                        town.insalubrityOrderBy !== null &&
                        town.insalubrityOrder
                    "
                >
                    Par : {{ town.insalubrityOrderBy }}
                </p>
            </FicheSiteProceduresLigne>

            <FicheSiteProceduresLigne
                v-if="town.insalubrityOrder && town.insalubrityOrderDisplayed"
                icon="signs-post"
                :label="labels.insalubrity_order_displayed"
            >
            </FicheSiteProceduresLigne>

            <FicheSiteProceduresLigne
                v-if="town.insalubrityOrder"
                icon="map-location-dot"
                :label="labels.insalubrity_parcels"
            >
                {{ town.insalubrityParcels || "non précisé" }}
            </FicheSiteProceduresLigne>
        </FicheSiteProceduresRubrique>

        <FicheSiteProceduresRubrique>
            <FicheSiteProceduresLigne
                icon="person-military-pointing"
                :label="labels.police_status"
                :border="false"
            >
                {{ policeStatus }}
            </FicheSiteProceduresLigne>

            <FicheSiteProceduresLigne
                v-if="town.policeStatus === 'granted'"
                icon="book"
                :label="labels.existing_litigation"
            >
                {{ existingLitigationStatus }}
            </FicheSiteProceduresLigne>

            <FicheSiteProceduresLigne
                v-if="
                    town.justiceProcedure ||
                    town.evacuation_under_time_limit ||
                    town.insalubrityOrder
                "
                icon="book-open-reader"
                :label="labels.bailiff"
            >
                {{ town.bailiff || "non communiqué" }}
            </FicheSiteProceduresLigne>
        </FicheSiteProceduresRubrique>
    </FicheRubrique>
</template>

<script setup>
import { defineProps, toRefs, computed, watch } from "vue";
import formatBool from "@/utils/formatBool";
import formatDate from "@common/utils/formatDate";
import { useModaleStore } from "@/stores/modale.store";

import { useEventBus } from "@common/helpers/event-bus";

import FicheRubrique from "@/components/FicheRubrique/FicheRubrique.vue";
import FicheSiteProceduresRubrique from "./FicheSiteProceduresRubrique.vue";
import FicheSiteProceduresLigne from "./FicheSiteProceduresLigne.vue";
import ModaleListeAccesPJ from "@/components/ModaleListeAccesPJ/ModaleListeAccesPJ.vue";
import labels from "@/components/Common/FormEtFicheSite.labels";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
const { bus } = useEventBus();

const justiceRendered = computed(() => {
    if (town.value.justiceRendered === null) {
        return "non communiqué";
    }

    if (town.value.justiceRendered !== true) {
        return "non";
    }

    const str = `le ${formatDate(town.value.justiceRenderedAt, "d/m/y")}`;
    if (!town.value.justiceRenderedBy) {
        return str;
    }

    return `${str} par « ${town.value.justiceRenderedBy} »`;
});

function getPoliceStatus(policeStatus, policeRequestedAt, policeGrantedAt) {
    if (policeStatus === "none") {
        return "non demandé";
    }

    if (policeStatus === "requested") {
        return `demandé le ${formatDate(policeRequestedAt, "d/m/y")}`;
    }

    if (policeStatus === "refused") {
        return "refusé";
    }

    if (policeStatus === "granted") {
        return `accordé le ${formatDate(policeGrantedAt, "d/m/y")}`;
    }

    return "non communiqué";
}

const policeStatus = computed(() => {
    return getPoliceStatus(
        town.value.policeStatus,
        town.value.policeRequestedAt,
        town.value.policeGrantedAt
    );
});

const existingLitigationStatus = computed(() => {
    if (town.value.existingLitigation === null) {
        return "non communiqué";
    }

    if (town.value.existingLitigation !== true) {
        return "non";
    }

    return "oui";
});

const administrativeOrderStatus = computed(() => {
    if (town.value.evacuationUnderTimeLimit === null) {
        return "non communiqué";
    }

    if (town.value.evacuationUnderTimeLimit !== true) {
        return "non";
    }

    return `${
        town.value.administrativeOrderDecisionAt === null
            ? "oui"
            : "oui, arrêté pris le " +
              formatDate(town.value.administrativeOrderDecisionAt, "d/m/y")
    }`;
});

const insalubrityOrderStatus = computed(() => {
    // Décomposition préliminaire pour améliorer la lisibilité
    const { insalubrityOrder, insalubrityOrderAt } = town.value;
    if (insalubrityOrder === null) {
        return "non communiqué";
    }

    if (insalubrityOrder !== true) {
        return "non";
    }

    return `${
        insalubrityOrderAt
            ? "Pris le " + formatDate(insalubrityOrderAt, "d/m/y")
            : ""
    }`;
});

const ProcedureJudiciaire = computed(() => {
    return [
        {
            icon: "scroll",
            label: labels.owner_complaint,
            border: false,
            condition: true,
            value: formatBool(town.value.ownerComplaint),
        },
        {
            icon: "balance-scale",
            label: labels.justice_procedure,
            border: true,
            condition: true,
            value: formatBool(town.value.justiceProcedure),
        },
        {
            icon: "gavel",
            label: labels.justice_rendered,
            border: true,
            condition: town.value.justiceProcedure,
            value: justiceRendered.value,
        },
        {
            icon: "handshake",
            label: labels.justice_challenged,
            border: true,
            condition: town.value.justiceRendered,
            value: formatBool(town.value.justiceChallenged),
        },
    ];
});

const filteredProcedureJudiciaire = computed(() => {
    return ProcedureJudiciaire.value.filter((procedure) => procedure.condition);
});

watch(
    () => bus.value.get("fichesitepj:openListAccesPJ"),
    () => {
        const modaleStore = useModaleStore();
        modaleStore.open(ModaleListeAccesPJ, {
            future: false,
            townId: town.value.id,
        });
    }
);
</script>
