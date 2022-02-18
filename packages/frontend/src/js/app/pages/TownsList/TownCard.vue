<template>
    <div
        data-cy="townCard"
        :class="[
            'rounded-sm cursor-pointer border border-cardBorder preventPrintBreak',
            isHover ? 'bg-blue200 border-transparent' : '',
            shantytown.closedAt ? 'closedShantytown' : ''
        ]"
        @mouseenter="isHover = true"
        @mouseleave="isHover = false"
    >
        <router-link :to="`/site/${shantytown.id}`">
            <div class="-mt-1 print:mt-0">
                <div class="mb-4 px-6">
                    <Tag
                        :class="[
                            'text-xs uppercase text-primary',
                            isHover ? 'shadow-md' : ''
                        ]"
                    >
                        {{ lastUpdate }}
                    </Tag>
                    <Tag
                        :class="['ml-4 py-1 px-3', isHover ? 'shadow-md' : '']"
                        variant="highlight"
                        v-if="shantytown.resorptionTarget"
                    >
                        Objectif résorption
                        {{ shantytown.resorptionTarget }} par la Préfecture
                    </Tag>
                </div>
                <div class="text-md px-6">
                    <div class="text-primary text-display-md ">
                        <span class="font-bold">
                            {{ shantytown.addressSimple }}
                            <span v-if="shantytown.name"
                                >« {{ shantytown.name }} »</span
                            >
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
                <div
                    class="md:grid print:grid cardGridTemplateColumns gap-10 px-6 py-4"
                >
                    <!-- first column -->
                    <div>
                        <TownField :fieldType="shantytown.fieldType" />
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
                        <div
                            v-if="shantytown.populationTotal === null"
                            class="font-bold"
                        >
                            Population : inconnu
                        </div>
                        <TownPopulation
                            v-else
                            class="text-lg font-bold"
                            :population="shantytown.populationTotal"
                        />
                        <div>
                            <div
                                v-if="!shantytown.socialOrigins.length"
                                class="text-G600"
                            >
                                Origine : inconnu
                            </div>
                            <div
                                class="flex"
                                v-for="origin in shantytown.socialOrigins"
                                v-else
                                :key="origin.id"
                            >
                                <img
                                    :src="socialOrigin(origin).img"
                                    class=" w-6 h-4 mr-2 mt-1"
                                />
                                <div>{{ socialOrigin(origin).label }}</div>
                            </div>
                        </div>
                    </div>
                    <!-- third column - open shantytowns -->
                    <div v-if="showLivingConditionDetails">
                        <div>
                            <TownCardIcon
                                :value="shantytown.accessToWater"
                                :details="details.water"
                                >eau</TownCardIcon
                            >
                            <TownCardIcon
                                :value="shantytown.accessToSanitary"
                                :details="details.sanitary"
                                >toilettes</TownCardIcon
                            >
                            <TownCardIcon
                                :value="shantytown.electricityType.value"
                                >électricité</TownCardIcon
                            >

                            <TownCardIcon
                                :value="shantytown.trashEvacuation"
                                :details="details.trash"
                                >évac. des déchets</TownCardIcon
                            >

                            <TownCardIcon
                                :value="shantytown.vermin"
                                :details="details.vermin"
                                inverted
                                >pres. de nuisibles</TownCardIcon
                            >
                            <TownCardIcon
                                :value="shantytown.firePreventionMeasures"
                                :details="details.firePrevention"
                                >prev. incendie</TownCardIcon
                            >
                        </div>
                    </div>
                    <!-- third column - closed shantytowns -->
                    <div v-else>
                        <ClosingSolutionsList
                            :shantytownClosingSolutions="
                                shantytown.closingSolutions
                            "
                        ></ClosingSolutionsList>
                    </div>
                    <!-- fourth column -->
                    <div v-if="hasJusticePermission">
                        <div
                            v-if="
                                !shantytown.justiceStatuses ||
                                    !shantytown.justiceStatuses.length
                            "
                            class="text-G600"
                        >
                            <Icon icon="ban" />
                            Aucune procédure judiciaire en cours
                        </div>
                        <div v-else>
                            <div
                                class="flex "
                                v-for="status in shantytown.justiceStatuses"
                                :key="status.label"
                            >
                                <Icon v-if="status.icon" :icon="status.icon" />
                                <img
                                    class="w-5 h-4 mt-1"
                                    :src="status.img"
                                    v-if="status.img"
                                />
                                <div class="ml-2">
                                    <span class="font-bold">{{
                                        status.label
                                    }}</span>
                                    <span v-if="status.date" class="secondary">
                                        le
                                        {{
                                            formatDate(status.date, "d/m/y")
                                        }}</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- fifth column -->
                    <div class="flex">
                        <div
                            v-bind:class="{
                                'text-G600': shantytown.actors.length === 0,
                                'text-primary': shantytown.actors.length > 0,
                                'font-bold': shantytown.actors.length > 0
                            }"
                        >
                            <span><Icon icon="user-circle"/></span>
                        </div>
                        <div class="ml-2 flex-grow">
                            <span
                                v-if="shantytown.actors.length === 0"
                                class="text-G600"
                            >
                                Aucun intervenant</span
                            >
                            <span v-else class="text-primary font-bold"
                                >{{ shantytown.actors.length }} intervenant{{
                                    shantytown.actors.length > 1 ? "s" : ""
                                }}</span
                            >
                            <ul
                                v-if="shantytown.actors.length > 0"
                                class="text-primary"
                            >
                                <li
                                    v-for="actor in mergedActors"
                                    v-bind:key="actor.id"
                                >
                                    - {{ actor.name }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="flex justify-end px-4 pt-4 print:hidden">
                    <div class="print:hidden">
                        <transition
                            name="fade"
                            v-if="isOpen && hasUpdateShantytownPermission"
                        >
                            <router-link
                                v-if="isHover"
                                :to="`/site/${shantytown.id}/mise-a-jour`"
                            >
                                <Button
                                    variant="primaryText"
                                    icon="pen"
                                    iconPosition="left"
                                    class="text-display-sm hover:underline -mb-1"
                                    >Mettre à jour</Button
                                >
                            </router-link>
                        </transition>
                        <Button
                            variant="primaryText"
                            icon="arrow-right"
                            class="text-display-sm hover:underline -mb-1"
                            >Voir la fiche du site</Button
                        >
                    </div>
                </div>
            </div>
        </router-link>
    </div>
</template>

<script>
import TownCardIcon from "./TownCardIcon";
import TownField from "#app/components/TownField/TownField.vue";
import TownPopulation from "#app/components/TownPopulation/TownPopulation.vue";
import ClosingSolutionsList from "./ClosingSolutionsList";
import flagEU from "./assets/eu.png";
import flagFR from "./assets/fr.png";
import flagExtraCommunautaires from "./assets/extra-communautaires.png";
import formatLastUpdatedAt from "#app/utils/formatLastUpdatedAt";
import { formatLivingConditions } from "#app/pages/TownDetails/formatLivingConditions";
import { isSolved, isClosed } from "./common/SolvedOrClosed";

export default {
    props: {
        shantytown: {
            type: Object
        },
        hasJusticePermission: {
            type: Boolean
        },
        hasUpdateShantytownPermission: {
            type: Boolean
        }
    },
    data() {
        return {
            isHover: false,
            details: formatLivingConditions(this.shantytown)
        };
    },
    components: {
        TownCardIcon,
        ClosingSolutionsList,
        TownField,
        TownPopulation
    },
    methods: {
        /**
         * @see index.js
         */
        formatDate(...args) {
            return window.App.formatDate.apply(window, args);
        },
        /**
         * @see index.js
         */
        dateDiff(...args) {
            return window.App.dateDiff.apply(window, args);
        },
        socialOrigin(origin) {
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
        },
        isSolved,
        isClosed
    },
    computed: {
        isOpen() {
            return this.shantytown.status === "open";
        },
        mergedActors() {
            return Object.values(
                this.shantytown.actors.reduce((acc, actor) => {
                    if (acc[actor.organization.id] !== undefined) {
                        return acc;
                    }

                    return {
                        ...acc,
                        [actor.organization.id]: actor.organization
                    };
                }, {})
            );
        },
        lastUpdate() {
            return `${formatLastUpdatedAt(this.shantytown)}`;
        },
        showLivingConditionDetails() {
            return !(isSolved(this.shantytown) || isClosed(this.shantytown));
        }
    }
};
</script>

<style scoped lang="scss">
.cardGridTemplateColumns {
    grid-template-columns: 160px 208px 164px 200px auto;

    @media print {
        grid-template-columns: 160px 208px 164px 200px 236px;
    }
}

.closedShantytown {
    position: relative;
    overflow: hidden;
}

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

.preventPrintBreak {
    @media print {
        // firefox
        break-inside: avoid;
        // webkit (chrome/brave/edge)
        page-break-inside: avoid;
    }
}
</style>
