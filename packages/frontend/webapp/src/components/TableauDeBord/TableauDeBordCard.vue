<template>
    <div
        :id="`card_${cardKey}`"
        class="p-5 !pt-16 fr-card row-span-2 shadow-md rounded-sm !gap-16"
        :class="{ '!row-span-1': cardActions.length === 1 }"
    >
        <div class="fr-card__body -mb-4">
            <div class="fr-card__content gap-2">
                <DsfrTile
                    v-for="(action, index) in cardActions"
                    :class="{
                        '!bg-blue100': action.mainAction,
                        'hover:!bg-blue200': action.mainAction,
                    }"
                    :key="index"
                    :id="`card_${cardKey}`"
                    :icon="true"
                    :noBackground="false"
                    :download="false"
                    :shadow="true"
                    :noBorder="action.mainAction ? false : true"
                    :description="action.description"
                    :small="true"
                    :horizontal="true"
                    :title="action.label"
                    :imgSrc="action.icon"
                    :to="!action.clickMgmt ? action.to : ''"
                    :svgAttrs="svgAttrs"
                    @click.prevent="
                        () => {
                            if (action.clickMgmt) {
                                handleSearchClick(action.clickMgmt);
                            } else {
                                resetSearch(action.to);
                            }
                        }
                    "
                />
            </div>
        </div>
        <div
            class="flex flex-row gap-2 justify-left p-4 absolute !h-16 w-full bg-slate-100 items-center border-x border-t"
        >
            <Icon
                :icon="cardIcon"
                class="flex rounded-full bg-primary p-3 justify-center items-center place-self-center text-2xl text-white w-12 border-2 border-green300 h-12"
            />
            <p class="place-self-stretch items-center !text-2xl">
                {{ cardName }}
            </p>
        </div>
    </div>
</template>

<script setup>
import { toRefs } from "vue";
import { Icon } from "@resorptionbidonvilles/ui";
import TableauDeBordModale from "./TableauDeBordModale.vue";
import { trackEvent } from "@/helpers/matomo";

import { useModaleStore } from "@/stores/modale.store";
import { useTownsStore } from "@/stores/towns.store";
import { useActionsStore } from "@/stores/actions.store";

const props = defineProps({
    cardName: {
        type: String,
        required: true,
        default: "",
    },
    cardKey: {
        type: String,
        required: true,
        default: "",
    },
    cardActions: {
        type: Array,
        required: true,
        default: () => [],
    },
    cardIcon: {
        type: String,
        required: false,
        default: "",
    },
});
const { cardName, cardKey, cardActions, cardIcon } = toRefs(props);

const svgAttrs = { viewBox: "0 0 80 80" };

const modaleStore = useModaleStore();

const handleSearchClick = (cardType) => {
    const cardData = cardActions.value.find(
        (action) => action.clickMgmt === cardType
    );

    modaleStore.open(TableauDeBordModale, {
        type: cardType,
        to: cardData.to,
        title: cardData.label,
        placeHolder: cardData.placeHolder,
    });
};

const resetSearch = (to) => {
    let activeStore = null;
    if (to === "/liste-des-sites") {
        activeStore = useTownsStore();
    } else if (to === "/liste-des-actions") {
        activeStore = useActionsStore();
    }
    if (activeStore) {
        activeStore.filters.search = "";
        activeStore.filters.location = null;
    }

    trackingMotomo(to);
};

const trackingMotomo = (to) => {
    trackEvent("Tableau de bord", "Click", to);
};
</script>
