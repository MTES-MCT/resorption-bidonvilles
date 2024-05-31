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
                label="Une procédure administrative prescrivant l'évacuation sous délai est-elle en cours ?"
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
                label="Un arrêté d'insalubrité dans le cadre d'une opération RHI bidonville est-il en cours ?"
            >
                {{ formatBool(town.insalubrityOrder) }}
            </FicheSiteProceduresLigne>

            <FicheSiteProceduresLigne
                v-if="town.insalubrityOrder"
                icon="signs-post"
                label="Affichage de l'arrêté ou notification"
            >
                <p>{{ formatBool(town.insalubrityOrderDisplayed) }}</p>
                <p>
                    {{ insalubrityOrderDisplayStatus }}
                </p>
                <p v-if="town.insalubrityOrderBy">
                    Pris par : {{ town.insalubrityOrderBy }}
                </p>
            </FicheSiteProceduresLigne>

            <FicheSiteProceduresLigne
                v-if="town.insalubrityOrder"
                icon="map-location-dot"
                label="Quelles sont les parcelles concernées"
            >
                {{ town.insalubrityParcels || "non précisé" }}
            </FicheSiteProceduresLigne>
        </FicheSiteProceduresRubrique>

        <FicheSiteProceduresRubrique v-if="town.policeStatus">
            <FicheSiteProceduresLigne
                icon="person-military-pointing"
                label="Concours de la force publique"
                :border="false"
            >
                {{ policeStatus }}
            </FicheSiteProceduresLigne>

            <FicheSiteProceduresLigne
                v-if="town.policeStatus === 'granted'"
                icon="book"
                label="Existence d'un contentieux ?"
            >
                {{ existingLitigationStatus }}
            </FicheSiteProceduresLigne>

            <FicheSiteProceduresLigne
                v-if="town.justiceProcedure"
                icon="book-open-reader"
                label="Nom de l'étude d'huissier"
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

const insalubrityOrderDisplayStatus = computed(() => {
    // Décomposition préliminaire pour améliorer la lisibilité
    const {
        insalubrityOrder,
        insalubrityOrderDisplayed,
        insalubrityOrderType,
        insalubrityOrderAt,
    } = town.value;

    // Vérifie d'abord si les ordres d'insalubrité sont activés et affichés
    if (insalubrityOrder && insalubrityOrderDisplayed) {
        let displayStatus = "affiché";

        // Si un type d'ordre est présent, ajoute ce type au statut d'affichage
        if (insalubrityOrderType) {
            displayStatus = `${insalubrityOrderType} affiché`;

            // Si une date est également présente, l'ajoute au statut
            if (insalubrityOrderAt) {
                displayStatus += ` le ${formatDate(
                    insalubrityOrderAt,
                    "d/m/y"
                )}`;
            }
        }
        return displayStatus;
    }

    // Retourne null si les conditions de base ne sont pas remplies
    return null;
});

const ProcedureJudiciaire = computed(() => {
    return [
        {
            icon: "scroll",
            label: "Une plainte a-t-elle été déposée par le propriétaire ?",
            border: false,
            condition: true,
            value: formatBool(town.value.ownerComplaint),
        },
        {
            icon: "balance-scale",
            label: "Une procédure judiciaire a-t-elle été engagée ?",
            border: true,
            condition: true,
            value: formatBool(town.value.justiceProcedure),
        },
        {
            icon: "gavel",
            label: "Décision de justice rendue",
            border: true,
            condition: town.value.justiceProcedure,
            value: justiceRendered.value,
        },
        {
            icon: "handshake",
            label: "Contentieux",
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
