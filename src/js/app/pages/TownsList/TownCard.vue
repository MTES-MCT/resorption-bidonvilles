<template>
    <div
        :class="[
            'rounded-sm cursor-pointer border',
            isHover ? 'bg-blue100 border-transparent' : ''
        ]"
        @mouseenter="isHover = true"
        @mouseleave="isHover = false"
    >
        <router-link :to="`site/${shantytown.id}`">
            <div class="pt-6">
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
                <div
                    class="md:grid print:grid cardGridTemplateColumns gap-10 px-6 py-4"
                >
                    <!-- first column -->
                    <div>
                        <div class="flex items-center customAlign">
                            <Icon
                                icon="map-marker-alt"
                                class="text-lg"
                                :style="`color: ${shantytown.fieldType.color}`"
                            />
                            <div class="font-bold ml-2">
                                {{ shantytown.fieldType.label }}
                            </div>
                        </div>
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
                            Population inconnue
                        </div>
                        <div v-else class="text-lg font-bold flex items-center">
                            <div class="mr-2">
                                {{ shantytown.populationTotal }}
                            </div>
                            <div>
                                <Icon icon="male" />{{ " " }}
                                <span v-if="shantytown.populationTotal >= 25">
                                    <Icon icon="male" />{{ " " }}</span
                                >
                                <span v-if="shantytown.populationTotal >= 75"
                                    ><Icon icon="male" />{{ " " }}</span
                                >
                                <span v-if="shantytown.populationTotal >= 100"
                                    ><Icon icon="male"
                                /></span>
                            </div>
                        </div>
                        <div>
                            <div
                                v-if="!shantytown.socialOrigins.length"
                                class="text-G600"
                            >
                                Origine : inconnue
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
                    <!-- third column -->
                    <div>
                        <div>
                            <TownCardIcon :value="shantytown.accessToWater"
                                >eau</TownCardIcon
                            >
                            <TownCardIcon
                                :value="shantytown.electricityType.value"
                                >électricité</TownCardIcon
                            >

                            <TownCardIcon :value="shantytown.trashEvacuation"
                                >évac. des déchets</TownCardIcon
                            >
                            <TownCardIcon :value="shantytown.accessToSanitary"
                                >toilettes</TownCardIcon
                            >
                        </div>
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
                </div>
                <div
                    class="flex justify-between items-center px-4 pt-4 print:pt-0"
                >
                    <Tag class="text-xs">
                        {{ lastUpdate }}
                    </Tag>
                    <div class="print:hidden">
                        <transition name="fade">
                            <router-link
                                v-if="isHover"
                                :to="`site/${shantytown.id}`"
                            >
                                <Button
                                    variant="secondaryText"
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
import flagEU from "./assets/eu.png";
import flagFR from "./assets/fr.png";
import flagExtraCommunautaires from "./assets/extra-communautaires.png";
import getSince from "./getSince";

export default {
    props: {
        shantytown: {
            type: Object
        },
        hasJusticePermission: {
            type: Boolean
        }
    },
    data() {
        return {
            isHover: false
        };
    },
    components: {
        TownCardIcon
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
        }
    },
    computed: {
        lastUpdate() {
            const { days, months, weeks } = getSince(this.shantytown.updatedAt);

            if (months === 0) {
                if (days === 0) {
                    return `Dernière actualisation aujourd'hui`;
                }

                if (days > 0 && days < 7) {
                    return `Dernière actualisation il y a ${days} jour${
                        days > 1 ? "s" : ""
                    }`;
                }

                if (weeks > 0 && months === 0) {
                    return `Dernière actualisation il y a ${weeks} semaine${
                        weeks > 1 ? "s" : ""
                    }`;
                }
            }

            if (months < 12) {
                return `Dernière actualisation il y a ${months} mois`;
            }

            return "Dernière actualisation il y a plus d'un an";
        }
    }
};
</script>

<style scoped lang="scss">
.cardGridTemplateColumns {
    grid-template-columns: 160px 208px 164px auto;

    @media print {
        grid-template-columns: 160px 208px 164px 236px;
    }
}
.customAlign {
    height: 30px;
}
</style>
