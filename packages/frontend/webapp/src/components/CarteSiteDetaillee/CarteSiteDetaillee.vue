<template>
    <RouterLink custom v-slot="{ navigate }" :to="`/site/${shantytown.id}`">
        <div
            :class="[
                'rounded-sm cursor-pointer border-1 border-cardBorder preventPrintBreak print:h-[17.3rem]',
                isHover ? 'bg-blue200 border-transparent' : '',
                !isOpen ? 'closedShantytown' : '',
                focusClasses.outline,
            ]"
            :aria-label="`Fiche site ${shantytown.addressSimple} ${
                shantytown.name ? shantytown.name : ''
            } ${shantytown.city.name}`"
            @click="(event) => handleClickOnCard(event, navigate)"
            @mouseenter="isHover = true"
            @mouseleave="isHover = false"
        >
            <div class="-mt-1 print:mt-0">
                <CarteSiteDetailleeHeader
                    class="mb-4"
                    :shantytown="shantytown"
                    :isHover="isHover"
                />
                <CarteSiteDetailleeName :shantytown="shantytown" />
                <div
                    :class="[
                        'flex flex-col',
                        `space-y-${nbCol}`,
                        'lg:flex-none lg:grid',
                        `cardGridTemplateColumns${
                            nbCol === '5' ? 'Five' : 'Four'
                        }`,
                        'print:grid lg:gap-10 px-6 py-4 items-start',
                    ]"
                >
                    <CarteSiteDetailleeFieldType :shantytown="shantytown" />
                    <CarteSiteDetailleeOrigins
                        :shantytown="shantytown"
                        class="pl-5"
                    />
                    <template v-if="displayPhasesPreparatoiresResorption">
                        <CarteSiteDetailleePhasesPreparatoiresResorption
                            v-if="isOpen"
                            :shantytown="shantytown"
                        />
                    </template>
                    <template v-else>
                        <CarteSiteDetailleeLivingConditions
                            v-if="isOpen"
                            :shantytown="shantytown"
                        />
                        <CarteSiteDetailleeClosingSolutions
                            v-else
                            :shantytown="shantytown"
                        />
                    </template>
                    <CarteSiteDetailleeJustice
                        v-if="userStore.hasJusticePermission"
                        :shantytown="shantytown"
                    />
                    <CarteSiteDetailleeActors :shantytown="shantytown" />
                </div>

                <CarteSiteDetailleeFooter
                    :shantytown="shantytown"
                    :isHover="isHover"
                />
            </div>
        </div>
    </RouterLink>
</template>

<script setup>
import { defineProps, toRefs, computed, ref } from "vue";
import { useUserStore } from "@/stores/user.store";
import focusClasses from "@common/utils/focus_classes";

import CarteSiteDetailleeHeader from "./CarteSiteDetailleeHeader.vue";
import CarteSiteDetailleeName from "./CarteSiteDetailleeName.vue";
import CarteSiteDetailleeFieldType from "./CarteSiteDetailleeFieldType.vue";
import CarteSiteDetailleeOrigins from "./CarteSiteDetailleeOrigins.vue";
import CarteSiteDetailleeLivingConditions from "./CarteSiteDetailleeLivingConditions.vue";
import CarteSiteDetailleeClosingSolutions from "./CarteSiteDetailleeClosingSolutions.vue";
import CarteSiteDetailleeJustice from "./CarteSiteDetailleeJustice.vue";
import CarteSiteDetailleeActors from "./CarteSiteDetailleeActors.vue";
import CarteSiteDetailleeFooter from "./CarteSiteDetailleeFooter.vue";
import CarteSiteDetailleePhasesPreparatoiresResorption from "./CarteSiteDetailleePhasesPreparatoiresResorption.vue";
import departementsInResoprtionPhases from "@/utils/departements_in_resorption_phases";

const props = defineProps({
    shantytown: {
        type: Object,
    },
    currentTab: {
        type: String,
    },
});
const userStore = useUserStore();
const { shantytown, currentTab } = toRefs(props);
const isHover = ref(false);
const isOpen = computed(() => {
    return shantytown.value.status === "open";
});

const displayPhasesPreparatoiresResorption = computed(() => {
    return (
        departementsInResoprtionPhases.includes(
            parseInt(shantytown.value.departement.code, 10)
        ) && currentTab.value === "inProgress"
    );
});

// eslint-disable-next-line no-unused-vars
const nbCol = computed(() => {
    return userStore.hasJusticePermission ? "5" : "4";
});

function handleClickOnCard(event, navigateFunction) {
    // On vérifie si le clic vient d'un bouton du footer ou d'un click sur intervenant ou sur la tuile complète
    let targetElement = event.target;
    while (targetElement && targetElement !== event.currentTarget) {
        if (
            targetElement.tagName === "BUTTON" ||
            targetElement.tagName === "A" ||
            targetElement.closest(".carte-site-detaillee-footer-wrapper")
        ) {
            return; // Ne pas naviguer si le clic vient d'un bouton du footer
        }
        targetElement = targetElement.parentElement;
    }
    navigateFunction();
}
</script>

<style scoped lang="scss">
.cardGridTemplateColumnsFive {
    grid-template-columns: 160px 208px 250px auto 200px;

    @media print {
        grid-template-columns: 160px 208px 164px 200px 236px;
    }
}

.cardGridTemplateColumnsFour {
    grid-template-columns: 160px 208px auto 200px;

    @media print {
        grid-template-columns: 160px 208px 164px 236px;
    }
}

.closedShantytown {
    .cardGridTemplateColumns {
        @media print {
            grid-template-columns: 140px 91px 150px 154px 0px;
        }
    }
}

.closedShantytown {
    position: relative;
    overflow: hidden;
}

@media not print {
    .closedShantytown:before {
        position: absolute;
        pointer-events: none;
        content: "";
        background: linear-gradient(
            to left bottom,
            transparent 50%,
            currentColor 49.8%,
            currentColor 50.2%,
            transparent 50%
        );
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }
}

.preventPrintBreak {
    @media print {
        // firefox
        break-inside: avoid;
        // webkit (chrome/brave/edge)
        page-break-inside: avoid;
    }
}
</style>
