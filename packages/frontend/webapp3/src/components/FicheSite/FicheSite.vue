<template>
    <FicheSiteHeader
        :town="town"
        v-on:openCancel="openCancel"
        v-on:openCovid="openCovid"
        v-on:deleteTown="deleteTown"
        v-on:showExport="showExport"
    />

    <ContentWrapper>
        <ArrangementLeftMenu columnWidthClass="w-92" :tabs="tabs">
            <FicheSiteCaracteristiques :town="town" id="caracteristiques" />
            <FicheSiteFermeture
                v-if="town.closedAt !== null"
                :town="town"
                id="fermeture"
                class="mt-5"
            />
            <FicheSiteActions
                v-if="town.plans.length"
                :town="town"
                id="actions"
                class="mt-5"
            />
            <FicheSiteHabitants :town="town" id="habitants" class="mt-5" />
            <FicheSiteConditionsDeVie
                :town="town"
                id="conditions_de_vie"
                class="mt-5"
            />
            <FicheSiteProceduresJudiciaires
                v-if="userStore.hasJusticePermission"
                :town="town"
                id="procedure_judiciaire"
                class="mt-5"
            />
            <FicheSiteIntervenants
                :town="town"
                id="intervenants"
                class="mt-5"
            />
        </ArrangementLeftMenu>
    </ContentWrapper>

    <FicheSiteJournal class="mt-10" :town="town" />

    <FicheSiteModaleMesThemes :town="town" ref="modaleMesThemes" />
    <FicheSiteModaleInviterIntervenant
        :town="town"
        ref="modaleInviterIntervenant"
    />
</template>

<script setup>
import {
    defineProps,
    toRefs,
    computed,
    watch,
    ref,
    onMounted,
    onBeforeUnmount,
} from "vue";
import { useEventBus } from "@/helpers/event-bus";
import { useUserStore } from "@/stores/user.store";
import router from "@/helpers/router";
import menu from "./FicheSite.menu";

import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import ArrangementLeftMenu from "@/components/ArrangementLeftMenu/ArrangementLeftMenu.vue";
import FicheSiteHeader from "./FicheSiteHeader/FicheSiteHeader.vue";
import FicheSiteCaracteristiques from "./FicheSiteCaracteristiques/FicheSiteCaracteristiques.vue";
import FicheSiteFermeture from "./FicheSiteFermeture/FicheSiteFermeture.vue";
import FicheSiteActions from "./FicheSiteActions/FicheSiteActions.vue";
import FicheSiteHabitants from "./FicheSiteHabitants/FicheSiteHabitants.vue";
import FicheSiteConditionsDeVie from "./FicheSiteConditionsDeVie/FicheSiteConditionsDeVie.vue";
import FicheSiteProceduresJudiciaires from "./FicheSiteProceduresJudiciaires/FicheSiteProceduresJudiciaires.vue";
import FicheSiteIntervenants from "./FicheSiteIntervenants/FicheSiteIntervenants.vue";
import FicheSiteJournal from "./FicheSiteJournal/FicheSiteJournal.vue";
import FicheSiteModaleMesThemes from "./FicheSiteModaleMesThemes/FicheSiteModaleMesThemes.vue";
import FicheSiteModaleInviterIntervenant from "./FicheSiteModaleInviterIntervenant/FicheSiteModaleInviterIntervenant.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
const userStore = useUserStore();
const { bus } = useEventBus();
const modaleMesThemes = ref(null);
const modaleInviterIntervenant = ref(null);
const currentTab = ref(null);

onMounted(() => {
    if (router.currentRoute.value.query.action === "new_actor") {
        modaleMesThemes.value.open("Confirmez-vous intervenir sur ce site ?");
    }

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

const tabs = computed(() => {
    const arr = menu.filter((item) => {
        if (!item.condition) {
            return item;
        }

        return item.condition(town.value, userStore.hasJusticePermission);
    });

    return arr.map((item) => {
        item.active = item.id === currentTab.value;
        return item;
    });
});

function scrollToHash() {
    if (!router.currentRoute.value.hash) {
        return;
    }

    const el = document.querySelector(router.currentRoute.value.hash);
    if (el) {
        el.scrollIntoView({ behavior: "smooth" });
    }
}

function openCancel() {}

function openCovid() {}

function deleteTown() {}

function showExport() {}

watch(
    () => bus.value.get("fichesite:openInviteActorModal"),
    () => {
        modaleInviterIntervenant.value.open();
    }
);

watch(
    () => bus.value.get("fichesite:openSelfThemes"),
    () => {
        modaleMesThemes.value.open();
    }
);
</script>
