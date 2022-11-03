<template>
    <div :class="[
        'rounded-sm cursor-pointer border-1 border-cardBorder preventPrintBreak',
        isHover ? 'bg-blue200 border-transparent' : '',
        shantytown.closedAt ? 'closedShantytown' : ''
    ]" @mouseenter="isHover = true" @mouseleave="isHover = false">
        <RouterLink :to="`/site/${shantytown.id}`">
            <div class="-mt-1 print:mt-0">
                <div class="mb-4 px-6">
                    <Tag :variant="pinVariant" :class="[
                        'text-xs uppercase',
                        isHover ? 'shadow-md' : ''
                    ]">
                        {{ lastUpdate }}
                    </Tag>
                    <Tag v-if="heatwaveStatus === true" :variant="'highlight'" :class="[
                        'ml-4 text-xs uppercase text-primary',
                        isHover ? 'shadow-md' : ''
                    ]">
                        Risque Canicule
                    </Tag>
                    <ResorptionTargetTag class="ml-4" v-if="shantytown.resorptionTarget"
                        :target="shantytown.resorptionTarget" :isHover="isHover" />
                </div>
                <div class="text-md px-6">
                    <div class="text-primary text-display-md font-bold">
                        <span class="font-bold">
                            {{ shantytown.addressSimple }}
                            <span v-if="shantytown.name">« {{ shantytown.name }} »</span>
                        </span>
                        <span class="font-normal">
                            {{ shantytown.city.name }}
                        </span>
                    </div>
                </div>
                <!-- Site fermé ou résorbé ? -->
                <div class="px-6" v-if="isClosed(shantytown)">
                    Fermé le {{ formatDate(shantytown.closedAt, "d/m/y") }}
                </div>
                <div class="px-6" v-else-if="isSolved(shantytown)">
                    Résorbé le {{ formatDate(shantytown.closedAt, "d/m/y") }}
                </div>
                <!-- Fin site fermé ou résorbé ? -->
                <div class="lg:grid print:grid cardGridTemplateColumns gap-10 px-6 py-4">
                    <!-- first column -->
                    <div>
                        <TypeDeSite :fieldType="shantytown.fieldType" />
                        <div class="ml-5">
                            <div>
                                {{ shantytown.statusName }} depuis <br />
                                <span class="font-bold">{{
                                        shantytown.statusSince
                                }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- second column -->
                    <div>
                        <div v-if="shantytown.populationTotal === null" class="font-bold">
                            Population : inconnu
                        </div>
                        <NombreHabitants v-else class="text-lg font-bold" :population="shantytown.populationTotal" />
                        <div>
                            <div v-if="!socialOrigins.length" class="text-G600">
                                Origine : inconnu
                            </div>
                            <div class="flex" v-for="origin in socialOrigins" v-else :key="origin.id">
                                <img :src="origin.img" class=" w-6 h-4 mr-2 mt-1" />
                                <div>{{ origin.label }}</div>
                            </div>
                        </div>
                    </div>
                    <!-- third column - open shantytowns -->
                    <div v-if="showLivingConditionDetails">
                        <div v-if="shantytown.livingConditions.version === 2">
                            <CarteSiteDetailleeIcon :status="
                                shantytown.livingConditions.water.status
                                    .status
                            ">eau</CarteSiteDetailleeIcon>
                            <CarteSiteDetailleeIcon :status="
                                shantytown.livingConditions.sanitary.status
                                    .status
                            ">toilettes</CarteSiteDetailleeIcon>
                            <CarteSiteDetailleeIcon :status="
                                shantytown.livingConditions.electricity
                                    .status.status
                            ">électricité</CarteSiteDetailleeIcon>

                            <CarteSiteDetailleeIcon :status="
                                shantytown.livingConditions.trash.status
                                    .status
                            ">évac. des déchets</CarteSiteDetailleeIcon>

                            <CarteSiteDetailleeIcon :status="
                                shantytown.livingConditions[verminKey]
                                    .status.status
                            ">{{
        shantytown.livingConditions[verminKey]
            .status.status === "good"
            ? "abs. de nuisibles"
            : "pres. de nuisibles"
}}
                            </CarteSiteDetailleeIcon>
                            <CarteSiteDetailleeIcon :status="
                                shantytown.livingConditions[fireKey].status
                                    .status
                            ">prev. incendie</CarteSiteDetailleeIcon>
                        </div>
                        <div v-else>
                            <Tag variant="pin_red">Les conditions de vie évoluent : mettez les à
                                jour !</Tag>
                        </div>
                    </div>
                    <!-- third column - closed shantytowns -->
                    <div v-else>
                        <SolutionsDeFermeture :shantytownClosingSolutions="
                            shantytown.closingSolutions
                        "></SolutionsDeFermeture>
                    </div>
                    <!-- fourth column -->
                    <div v-if="userStore.hasJusticePermission">
                        <div v-if="
                            !shantytown.justiceStatuses ||
                            !shantytown.justiceStatuses.length
                        " class="text-G600">
                            <Icon icon="ban" />
                            Aucune procédure judiciaire en cours
                        </div>
                        <div v-else>
                            <div class="flex " v-for="status in shantytown.justiceStatuses" :key="status.label">
                                <Icon v-if="status.icon" :icon="status.icon" />
                                <img class="w-5 h-4 mt-1" :src="status.img" v-if="status.img" />
                                <div class="ml-2">
                                    <span class="font-bold">{{
                                            status.label
                                    }}</span>
                                    <span v-if="status.date" class="secondary">
                                        le
                                        {{
                                                formatDate(status.date, "d/m/y")
                                        }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- fifth column -->
                    <div class="flex">
                        <div v-bind:class="{
                            'text-G600': shantytown.actors.length === 0,
                            'text-primary': shantytown.actors.length > 0,
                            'font-bold': shantytown.actors.length > 0
                        }">
                            <span>
                                <Icon icon="user-circle" />
                            </span>
                        </div>
                        <div class="ml-2 flex-grow">
                            <span v-if="shantytown.actors.length === 0" class="text-G600">
                                Aucun intervenant</span>
                            <span v-else class="text-primary font-bold">{{ shantytown.actors.length }} intervenant{{
                                    shantytown.actors.length > 1 ? "s" : ""
                            }}</span>
                            <ul v-if="shantytown.actors.length > 0" class="text-primary">
                                <li v-for="actor in mergedActors" v-bind:key="actor.id">
                                    - {{ actor.name }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="flex justify-end h-14 items-center mr-4 space-x-4 print:hidden">
                    <Button v-if="isHover" variant="primaryOutline" icon="fa-regular fa-sun" iconPosition="left"
                        type="button" size="sm" @click="toggleHeatwave">
                        <template v-if="heatwaveStatus === false">Indiquer un risque "Canicule"</template>
                        <template v-else>Retirer le risque "Canicule"</template>
                    </Button>
                    <Button v-if="isHover && isOpen && hasUpdateShantytownPermission" variant="primaryOutline" size="sm"
                        icon="pencil-alt" iconPosition="left" :href="`/site/${shantytown.id}/mise-a-jour`">Mettre à
                        jour</Button>
                    <Link :to="`/site/${shantytown.id}`">
                    <Icon icon="arrow-right" /> Voir la fiche du site</Link>
                </div>
            </div>
        </RouterLink>
    </div>
</template>

<script setup>
import { defineProps, toRefs, computed, ref } from "vue";
import { RouterLink } from "vue-router";
import { useUserStore } from "@/stores/user.store";
import formatDate from "@/utils/formatDate";
import getSince from "@/utils/getSince";
import formatLastUpdatedAt from "@/utils/formatLastUpdatedAt";
import { setHeatwaveStatus } from "@/api/towns.api";
import isSolved from "@/utils/isShantytownSolved";
import isClosed from "@/utils/isShantytownClosed";
import { trackEvent } from "@/helpers/matomo";

import { Tag, Icon, Button, Link } from "@resorptionbidonvilles/ui";
import ResorptionTargetTag from "@/components/TagObjectifResorption/TagObjectifResorption.vue";
import TypeDeSite from "@/components/TypeDeSite/TypeDeSite.vue";
import NombreHabitants from "@/components/NombreHabitants/NombreHabitants.vue";
import SolutionsDeFermeture from "@/components/SolutionsDeFermeture/SolutionsDeFermeture.vue";
import CarteSiteDetailleeIcon from "./CarteSiteDetailleeIcon.vue";

import flagEU from "@/assets/flags/eu.png";
import flagFR from "@/assets/flags/fr.png";
import flagExtraCommunautaires from "@/assets/flags/extra-communautaires.png";

const props = defineProps({
    shantytown: {
        type: Object
    },
});
const userStore = useUserStore();
const { shantytown } = toRefs(props);

const isHover = ref(false);
const hasUpdateShantytownPermission = computed(() => {
    return userStore.hasUpdateShantytownPermission(shantytown.value);
});
const heatwaveStatus = computed(() => {
    return shantytown.value.heatwaveStatus;
});
const socialOrigins = computed(() => {
    return shantytown.value.socialOrigins.map((origin) => {
        if (origin.id === 1) {
            return { id: 1, label: "Français", img: flagFR };
        }

        if (origin.id === 2) {
            return { id: 2, label: "Union européenne", img: flagEU };
        }

        if (origin.id === 3) {
            return {
                id: 3,
                label: "Hors Union européenne",
                img: flagExtraCommunautaires
            };
        }

        return origin;
    });
});
const pinVariant = computed(() => {
    const { months } = getSince(shantytown.value.updatedAt);
    return months >= 3 ? "pin_red" : "pin";
});
const verminKey = computed(() => {
    return shantytown.value.livingConditions.version === 2
        ? "pest_animals"
        : "vermin";
});
const fireKey = computed(() => {
    return shantytown.value.livingConditions.version === 2
        ? "fire_prevention"
        : "firePrevention";
});
const isOpen = computed(() => {
    return shantytown.value.status === "open";
});
const mergedActors = computed(() => {
    return Object.values(
        shantytown.value.actors.reduce((acc, actor) => {
            if (acc[actor.organization.id] !== undefined) {
                return acc;
            }

            return {
                ...acc,
                [actor.organization.id]: actor.organization
            };
        }, {})
    );
});
const lastUpdate = computed(() => {
    return `${formatLastUpdatedAt(shantytown.value)}`;
});
const showLivingConditionDetails = computed(() => {
    return !(isSolved(shantytown.value) || isClosed(shantytown.value));
});

async function toggleHeatwave(event) {
    event.preventDefault();
    const value = !heatwaveStatus.value;

    try {
        // @todo : déplacer dans le store
        await setHeatwaveStatus(shantytown.value.id, {
            heatwave_status: value
        });
        trackEvent(
            "Site",
            `${value ? "Déclenchement" : "Suppression"
            } alerte canicule`,
            `S${shantytown.value.id}`
        );
    } catch (e) {
        // @todo
    }
}
</script>

<style scoped lang="scss">
.cardGridTemplateColumns {
    grid-template-columns: 160px 208px 170px 200px auto;

    @media print {
        grid-template-columns: 160px 208px 164px 200px 236px;
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
        background: linear-gradient(to left bottom,
                transparent 50%,
                currentColor 49.8%,
                currentColor 50.2%,
                transparent 50%);
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
