<template>
    <FicheActionHeader :plan="plan" />

    <ContentWrapper>
        <ArrangementLeftMenu columnWidthClass="w-96" :tabs="tabs" autonav>
            <FicheActionCaracteristiques :plan="plan" class="mb-8" />
            <FicheActionLocalisation :plan="plan" class="mb-8" />
            <FicheActionContacts :plan="plan" class="mb-8" />
            <FicheActionFinancements
                v-if="userStore.hasPermission('plan_finances.access')"
                :plan="plan"
                class="mb-8"
            />
            <FicheActionEquipe
                v-if="plan.states.length > 0"
                :plan="plan"
                class="mb-8"
            />
            <FicheActionPublic
                v-if="plan.states.length > 0"
                :audience="audience"
                class="mb-8"
            />
            <FicheActionDroitsCommuns
                v-if="plan.states.length > 0"
                :plan="plan"
                class="mb-8"
            />
            <FicheActionSante
                v-if="plan.states.length > 0 && topics.includes('health')"
                :plan="plan"
                class="mb-8"
            />
            <FicheActionEducation
                v-if="plan.states.length > 0 && topics.includes('school')"
                :plan="plan"
                class="mb-8"
            />
            <FicheActionEmploi
                v-if="plan.states.length > 0 && topics.includes('work')"
                :plan="plan"
                class="mb-8"
            />
            <FicheActionLogement
                v-if="plan.states.length > 0 && topics.includes('housing')"
                :plan="plan"
                class="mb-8"
            />
            <FicheActionSecurisation
                v-if="plan.states.length > 0 && topics.includes('safety')"
                :plan="plan"
                class="mb-8"
            />
            <FicheActionAbsenceIndicateurs
                v-if="plan.states.length === 0"
                :plan="plan"
                class="mb-8"
            />
        </ArrangementLeftMenu>
    </ContentWrapper>

    <FicheActionJournal
        :plan="plan"
        class="mt-4"
        v-if="userStore.hasLocalizedPermission('plan_comment.list', plan)"
    />
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import { useUserStore } from "@/stores/user.store";
import menu from "./FicheAction.menu";

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

const userStore = useUserStore();

const tabs = computed(() => {
    return menu
        .filter((item) => {
            if (!item.condition) {
                return item;
            }

            return item.condition(plan.value);
        })
        .map((item) => {
            return {
                ...item,
                label: item.label(plan.value),
            };
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
</script>
