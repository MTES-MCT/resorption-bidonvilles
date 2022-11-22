<template>
    <FicheActionHeader :plan="plan" v-on:openCancel="closePlan" />
    <ContentWrapper>
        <ArrangementLeftMenu columnWidthClass="w-92" :tabs="tabs">
            <FicheActionCaracteristiques :plan="plan" id="caracteristiques" />
            <FicheActionLocalisation :plan="plan" id="localisation" />
            <FicheActionContacts :plan="plan" id="contacts" />
            <FicheActionFinancements
                v-if="userStore.hasPermission('plan_finances.access')"
                :plan="plan"
                id="financements"
            />
            <FicheActionEquipe
                v-if="plan.states.length > 0"
                :plan="plan"
                id="equipe"
            />
            <FicheActionPublic
                v-if="plan.states.length > 0"
                :audience="audience"
                id="public"
            />
            <FicheActionDroitsCommuns
                v-if="plan.states.length > 0"
                :plan="plan"
                id="droits_communs"
            />
            <FicheActionSante
                v-if="plan.states.length > 0 && topics.includes('health')"
                :plan="plan"
                id="sante"
            />
            <FicheActionEducation
                v-if="plan.states.length > 0 && topics.includes('school')"
                :plan="plan"
                id="education"
            />
            <FicheActionEmploi
                v-if="plan.states.length > 0 && topics.includes('work')"
                :plan="plan"
                id="emploi"
            />
            <FicheActionLogement
                v-if="plan.states.length > 0 && topics.includes('housing')"
                :plan="plan"
                id="logement"
            />
            <FicheActionSecurisation
                v-if="plan.states.length > 0 && topics.includes('safety')"
                :plan="plan"
                id="securisation"
            />
            <FicheActionAbsenceIndicateurs
                v-if="plan.states.length === 0 && plan.canUpdateMarks"
            />
        </ArrangementLeftMenu>
    </ContentWrapper>
    <FicheActionJournal id="journal_de_l_action" :plan="plan" />
</template>

<script setup>
import {
    defineProps,
    toRefs,
    ref,
    computed,
    onMounted,
    onBeforeUnmount,
} from "vue";
import router from "@/helpers/router";
import menu from "./FicheAction.menu";
import { useUserStore } from "@/stores/user.store";

import ArrangementLeftMenu from "@/components/ArrangementLeftMenu/ArrangementLeftMenu.vue";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import FicheActionHeader from "./FicheActionHeader/FicheActionHeader.vue";
import FicheActionCaracteristiques from "./FicheActionCaracteristiques/FicheActionCaracteristiques.vue";
import FicheActionLocalisation from "./FicheActionLocalisation.vue/FicheActionLocalisation.vue";
import FicheActionContacts from "./FicheActionContacts/FicheActionContacts.vue";
import FicheActionFinancements from "./FicheActionFinancements/FicheActionFinancements.vue";
import FicheActionEquipe from "./FicheActionEquipe/FicheActionEquipe.vue";
import FicheActionPublic from "./FicheActionPublic/FicheActionPublic.vue";
import FicheActionDroitsCommuns from "./FicheActionDroitsCommuns/FicheActionDroitsCommuns.vue";
import FicheActionSante from "./FicheActionSante/FicheActionSante.vue";
import FicheActionEducation from "./FicheActionEducation/FicheActionEducation.vue";
import FicheActionEmploi from "./FicheActionEmploi/FicheActionEmploi.vue";
import FicheActionLogement from "./FicheActionLogement/FicheActionLogement.vue";
import FicheActionSecurisation from "./FicheActionSecurisation/FicheActionSecurisation.vue";
import FicheActionAbsenceIndicateurs from "./FicheActionAbsenceIndicateurs/FicheActionAbsenceIndicateurs.vue";
import FicheActionJournal from "./FicheActionJournal/FicheActionJournal.vue";

const props = defineProps({
    plan: Object,
});
const { plan } = toRefs(props);
const currentTab = ref(null);

const userStore = useUserStore();

onMounted(() => {
    window.addEventListener("scroll", handleMenuScroll);
    scrollToHash();
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleMenuScroll);
});

function handleMenuScroll() {
    const tab = tabs.value.find(({ id }) => {
        const el = document.getElementById(id);
        // la section active est la première dont la bordure supérieure est visible à l'écran
        // OU dont la bordure inférieure dépasse la moitié de l'écran
        return (
            el?.offsetTop >= window.scrollY ||
            el?.offsetTop + el?.offsetHeight >
                window.scrollY + document.body.offsetHeight / 2
        );
    });

    currentTab.value = tab?.id || null;
}

function scrollToHash() {
    if (!router.currentRoute.value.hash) {
        return;
    }

    const el = document.querySelector(router.currentRoute.value.hash);
    if (el) {
        el.scrollIntoView({ behavior: "smooth" });
    }
}

const tabs = computed(() => {
    const arr = menu.filter((item) => {
        if (!item.condition) {
            return item;
        }

        return item.condition(plan.value);
    });

    return arr.map((item) => {
        item.active = item.id === currentTab.value;
        return item;
    });
});

const topics = computed(() => {
    if (!plan.value) {
        return [];
    }

    return plan.value.topics.map(({ uid }) => uid);
});

const audience = computed(() => {
    if (!plan.value || plan.value.states.length === 0) {
        return null;
    }
    function sum(originalObj, additionalObj) {
        return {
            total: originalObj.total + additionalObj.total,
            families: originalObj.families + additionalObj.families,
            women: originalObj.women + additionalObj.women,
            minors: originalObj.minors + additionalObj.minors,
        };
    }

    return plan.value.states.reduce(
        (acc, { audience }) => {
            if (audience.in) {
                acc.in = sum(acc.in, audience.in);
            }

            if (audience.out_positive) {
                acc.out_positive = sum(acc.out_positive, audience.out_positive);
            }

            if (audience.out_abandoned) {
                acc.out_abandoned = sum(
                    acc.out_abandoned,
                    audience.out_abandoned
                );
            }

            if (audience.out_excluded) {
                acc.out_excluded = sum(acc.out_excluded, audience.out_excluded);
            }

            return acc;
        },
        {
            in: {
                total: 0,
                families: 0,
                women: 0,
                minors: 0,
            },
            out_positive: {
                total: 0,
                families: 0,
                women: 0,
                minors: 0,
            },
            out_abandoned: {
                total: 0,
                families: 0,
                women: 0,
                minors: 0,
            },
            out_excluded: {
                total: 0,
                families: 0,
                women: 0,
                minors: 0,
            },
        }
    );
});

function closePlan() {
    // TODO gérer modale de fermeture d'action
}
</script>
