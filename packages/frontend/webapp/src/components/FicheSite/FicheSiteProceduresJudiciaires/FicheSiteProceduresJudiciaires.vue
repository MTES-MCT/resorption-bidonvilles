<template>
    <FicheRubrique
        title="Procédure judiciaire ou administrative"
        category="procedure"
    >
        <FicheSiteProceduresJudiciairesRubrique>
            <FicheSiteProceduresJudiciairesLigne
                icon="scroll"
                label="Une plainte a-t-elle été déposée par le propriétaire ?"
                :border="false"
            >
                {{ formatBool(town.ownerComplaint) }}
            </FicheSiteProceduresJudiciairesLigne>

            <FicheSiteProceduresJudiciairesLigne
                icon="balance-scale"
                label="Une procédure judiciaire a-t-elle été engagée ?"
            >
                {{ formatBool(town.justiceProcedure) }}
            </FicheSiteProceduresJudiciairesLigne>

            <FicheSiteProceduresJudiciairesLigne
                label="Décision de justice rendue"
                icon="gavel"
                v-if="town.justiceProcedure"
            >
                {{ justiceRendered }}
            </FicheSiteProceduresJudiciairesLigne>

            <FicheSiteProceduresJudiciairesLigne
                label="Contentieux"
                icon="handshake"
                v-if="town.justiceRendered"
            >
                {{ formatBool(town.justiceChallenged) }}
            </FicheSiteProceduresJudiciairesLigne>
        </FicheSiteProceduresJudiciairesRubrique>

        <FicheSiteProceduresJudiciairesRubrique>
            <FicheSiteProceduresJudiciairesLigne
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
            </FicheSiteProceduresJudiciairesLigne>
        </FicheSiteProceduresJudiciairesRubrique>

        <FicheSiteProceduresJudiciairesRubrique>
            <FicheSiteProceduresJudiciairesLigne
                :border="false"
                icon="right-from-bracket"
                label="Un arrêté d'insalubrité dans le cadre d'une opération RHI bidonville est-il en cours ?"
            >
                {{ formatBool(town.insalubrityOrder) }}
            </FicheSiteProceduresJudiciairesLigne>

            <FicheSiteProceduresJudiciairesLigne
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
            </FicheSiteProceduresJudiciairesLigne>

            <FicheSiteProceduresJudiciairesLigne
                v-if="town.insalubrityOrder"
                icon="map-location-dot"
                label="Quelles sont les parcelles concernées"
            >
                {{ town.insalubrityParcels || "non précisé" }}
            </FicheSiteProceduresJudiciairesLigne>
        </FicheSiteProceduresJudiciairesRubrique>

        <FicheSiteProceduresJudiciairesRubrique v-if="town.policeStatus">
            <FicheSiteProceduresJudiciairesLigne
                icon="person-military-pointing"
                label="Concours de la force publique"
                :border="false"
            >
                {{ policeStatus }}
            </FicheSiteProceduresJudiciairesLigne>

            <FicheSiteProceduresJudiciairesLigne
                v-if="town.policeStatus === 'granted'"
                icon="book"
                label="Existence d'un contentieux ?"
            >
                {{ existingLitigationStatus }}
            </FicheSiteProceduresJudiciairesLigne>

            <FicheSiteProceduresJudiciairesLigne
                v-if="town.justiceProcedure"
                icon="book-open-reader"
                label="Nom de l'étude d'huissier"
            >
                {{ town.bailiff || "non communiqué" }}
            </FicheSiteProceduresJudiciairesLigne>
        </FicheSiteProceduresJudiciairesRubrique>
    </FicheRubrique>
</template>

<script setup>
import { defineProps, toRefs, computed, watch } from "vue";
import formatBool from "@/utils/formatBool";
import formatDate from "@common/utils/formatDate";
import { useModaleStore } from "@/stores/modale.store";

import { useEventBus } from "@common/helpers/event-bus";

import FicheRubrique from "@/components/FicheRubrique/FicheRubrique.vue";
import FicheSiteProceduresJudiciairesRubrique from "./FicheSiteProceduresJudiciairesRubrique.vue";
import FicheSiteProceduresJudiciairesLigne from "./FicheSiteProceduresJudiciairesLigne.vue";
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
