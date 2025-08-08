<template>
    <BandeauNotice
        class="-mt-6"
        type="warning"
        title="Prévenir les risques lors des vagues de chaleur"
        description='Pensez à identifier les sites nécessitant une intervention urgente via le bouton "Alerte canicule" sur la liste des sites, et suivez les actions mises en œuvre via le journal du site.'
        width="w-3/4"
    />
    <FicheSiteHeader
        :town="town"
        v-on:openCancel="openCancel"
        v-on:deleteTown="deleteTown"
    />
    <ContentWrapper>
        <ArrangementLeftMenu columnWidthClass="w-90" :tabs="tabs" autonav>
            <FicheSiteResorption
                v-if="
                    displayPhasesPreparatoiresResorption &&
                    (!townIsClosed ||
                        town.preparatoryPhasesTowardResorption.length)
                "
                :town="town"
                id="resorption"
                class="mb-8"
            />
            <FicheSiteCaracteristiques
                :town="town"
                id="caracteristiques"
                class="mb-8"
            />
            <FicheSiteFermeture
                v-if="town.closedAt !== null"
                :town="town"
                id="fermeture"
                class="mb-8"
            />
            <FicheSiteActions
                v-if="town.actions.length"
                :town="town"
                id="actions"
                class="mb-8"
            />
            <FicheSiteHabitants :town="town" id="habitants" class="mb-8" />
            <FicheSiteConditionsDeVie
                :town="town"
                id="conditions_de_vie"
                class="mb-8"
            />
            <FicheSiteProcedures
                v-if="userStore.hasJusticePermission"
                :town="town"
                id="procedure"
                class="mb-8"
            />
            <FicheSiteIntervenants
                :town="town"
                id="intervenants"
                class="mb-12"
            />
        </ArrangementLeftMenu>
    </ContentWrapper>
    <FicheSiteJournal
        :town="town"
        v-if="userStore.hasLocalizedPermission('shantytown_comment.list', town)"
    />
    <FicheSiteHistorique :town="town" ref="historique" />
</template>

<script setup>
import { defineProps, toRefs, computed, watch, ref } from "vue";
import { useEventBus } from "@common/helpers/event-bus";
import { useUserStore } from "@/stores/user.store";
import { useTownsStore } from "@/stores/towns.store";
import menu from "./FicheSite.menu";

import { ContentWrapper } from "@resorptionbidonvilles/ui";
import ArrangementLeftMenu from "@/components/ArrangementLeftMenu/ArrangementLeftMenu.vue";
import BandeauNotice from "@/components/BandeauNotice/BandeauNotice.vue";
import FicheSiteHeader from "./FicheSiteHeader/FicheSiteHeader.vue";
import FicheSiteResorption from "./FicheSiteResorption/FicheSiteResorption.vue";
import FicheSiteCaracteristiques from "./FicheSiteCaracteristiques/FicheSiteCaracteristiques.vue";
import FicheSiteFermeture from "./FicheSiteFermeture/FicheSiteFermeture.vue";
import FicheSiteActions from "./FicheSiteActions/FicheSiteActions.vue";
import FicheSiteHabitants from "./FicheSiteHabitants/FicheSiteHabitants.vue";
import FicheSiteConditionsDeVie from "./FicheSiteConditionsDeVie/FicheSiteConditionsDeVie.vue";
import FicheSiteProcedures from "./FicheSiteProcedures/FicheSiteProcedures.vue";
import FicheSiteIntervenants from "./FicheSiteIntervenants/FicheSiteIntervenants.vue";
import FicheSiteJournal from "./FicheSiteJournal/FicheSiteJournal.vue";
import FicheSiteHistorique from "./FicheSiteHistorique/FicheSiteHistorique.vue";
import { usePhasesPreparatoiresResorption } from "@/utils/usePhasesPreparatoiresResorption";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
const userStore = useUserStore();
const townsStore = useTownsStore();
const { bus } = useEventBus();
const historique = ref(null);

const { displayPhasesPreparatoiresResorption } =
    usePhasesPreparatoiresResorption(town);

const tabs = computed(() => {
    const commentsAttachments = town.value.comments.reduce((sum, comment) => {
        return sum + (comment.attachments ? comment.attachments.length : 0);
    }, 0);
    const proceduresAttachments = town.value.attachments?.length;

    return menu
        .filter((item) => {
            if (!item.condition) {
                return item;
            }

            return item.condition(town.value);
        })
        .map((item) => {
            return {
                ...item,
                label: item.label(town.value),
                postIcon:
                    (item.id === "journal_du_site" &&
                        commentsAttachments > 0) ||
                    (item.id === "procedures" && proceduresAttachments > 0)
                        ? true
                        : false,
            };
        });
});

const townIsClosed = computed(
    () => town.value.closedAt !== null && town.value.closedAt !== undefined
);

watch(
    () => bus.value.get("fichesite:openHistorique"),
    (data) => {
        townsStore.townCategoryFilter = [...data];
        historique.value.open();
    }
);
</script>
