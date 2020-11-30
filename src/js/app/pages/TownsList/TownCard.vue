<template>
    <div
        :class="[
            'rounded-sm cursor-pointer border',
            isHover ? 'border-primary ' : 'cardShadow'
        ]"
        @mouseenter="isHover = true"
        @mouseleave="isHover = false"
    >
        <router-link :to="`site-new/${shantytown.id}`">
            <div class="pt-4">
                <div class="text-md px-4">
                    <div class="text-primary">
                        <span class="text-lg font-bold">
                            {{ shantytown.addressSimple }}
                            <span v-if="shantytown.name"
                                >« {{ shantytown.name }} »</span
                            >
                        </span>
                        <span>
                            {{ shantytown.city.name }}
                        </span>
                    </div>
                </div>
                <div class="md:grid cardGridTemplateColumns gap-8 px-4 py-4">
                    <!-- first column -->
                    <div>
                        <div class="flex items-center">
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
                            <div class="mt-2">
                                {{ shantytown.statusName }} depuis
                                {{ shantytown.statusSince }}
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
                        <div v-else class="text-md font-bold flex items-center">
                            <div class="mr-2">
                                {{ shantytown.populationTotal }}
                            </div>
                            <div class="text-md">
                                <Icon icon="male" /> <Icon icon="male" />
                                <Icon icon="male" /> <Icon icon="male" />
                            </div>
                        </div>
                        <div
                            class="mt-2 flex items-center"
                            v-for="origin in shantytown.socialOrigins"
                            :key="origin.id"
                        >
                            <img
                                :src="socialOrigin(origin).img"
                                class=" w-6 mr-2"
                            />
                            <span>{{ socialOrigin(origin).label }}</span>
                        </div>
                    </div>
                    <!-- third column -->
                    <div>
                        <div>
                            <TownCardIcon
                                :value="shantytown.accessToWater"
                                class="mb-1"
                                >eau</TownCardIcon
                            >
                            <TownCardIcon
                                :value="shantytown.electricityType.value"
                                class="mb-1"
                                >électricité</TownCardIcon
                            >

                            <TownCardIcon
                                :value="shantytown.trashEvacuation"
                                class="mb-1"
                                >évac. des déchets</TownCardIcon
                            >
                            <TownCardIcon
                                :value="shantytown.accessToSanitary"
                                class="mb-1"
                                >toilettes</TownCardIcon
                            >
                        </div>
                    </div>
                    <!-- fourth column -->
                    <div>
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
                                class="flex items-center flex-wrap"
                                v-for="status in shantytown.justiceStatuses"
                                :key="status.label"
                            >
                                <Icon v-if="status.icon" :icon="status.icon" />
                                <img
                                    class="w-5 h-4"
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
                    class="border-t flex justify-between items-center px-4 py-2"
                >
                    <Tag class="text-xs">
                        {{ lastUpdate }}
                    </Tag>
                    <div>
                        <!--   TODO: CHECK PERMISSIONS -->
                        <transition name="fade">
                            <router-link
                                v-if="isHover"
                                :to="`site/${shantytown.id}`"
                            >
                                <Button
                                    variant="secondaryText"
                                    icon="pen"
                                    iconPosition="left"
                                    class="text-display-sm hover:underline"
                                    >Mettre à jour</Button
                                >
                            </router-link>
                        </transition>
                        <Button
                            variant="primaryText"
                            icon="arrow-right"
                            class="text-display-sm hover:underline"
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

export default {
    props: {
        shantytown: {
            type: Object
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
                return { id: 2, label: "Européens", img: flagEU };
            }

            if (origin.id === 3) {
                return {
                    id: 3,
                    label: "Extra-communautaires",
                    img: flagExtraCommunautaires
                };
            }

            return origin;
        }
    },
    computed: {
        lastUpdate() {
            const d2 = new Date(this.shantytown.updatedAt * 1000);
            const d1 = new Date();

            let months;
            months = (d2.getFullYear() - d1.getFullYear()) * 12;
            months -= d1.getMonth() + 1;
            months += d2.getMonth();
            months = months <= 0 ? 0 : months;

            if (months === 0) {
                const days = Math.floor(
                    Math.abs(d1.getTime() - d2.getTime()) / (1000 * 3600 * 24)
                );
                const weeks = days / 7;

                if (days === 0) {
                    return `Dernière actualisation aujourd'hui`;
                }

                if (days > 0 && days < 7) {
                    return `Dernière actualisation il y a ${days} jours`;
                }

                if (weeks > 0) {
                    return `Dernière actualisation il y a plus d'une semaine`;
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

<style scoped>
.cardGridTemplateColumns {
    grid-template-columns: 220px 220px 220px auto;
}
</style>
