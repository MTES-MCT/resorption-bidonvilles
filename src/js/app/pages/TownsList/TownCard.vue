<template>
    <div
        :class="[
            'rounded-sm cursor-pointer border',
            isHover ? 'border-primary ' : 'border-transparent cardShadow'
        ]"
        @mouseenter="isHover = true"
        @mouseleave="isHover = false"
    >
        <router-link :to="`site/${shantytown.id}`">
            <div class="p-4 md:grid grid-cols-5 gap-8 text-sm">
                <div>
                    <div class="mb-1">
                        DPT {{ shantytown.departement.code }}
                    </div>
                    <div class="text-primary">
                        <div class="font-bold">
                            {{ shantytown.city.name }} ({{
                                shantytown.departement.name
                            }})
                        </div>
                        <div>
                            {{ shantytown.addressSimple }}
                        </div>
                        <div v-if="shantytown.name">
                            « {{ shantytown.name }} »
                        </div>
                    </div>
                </div>

                <div>
                    <div class="flex items-center">
                        <div
                            :style="
                                `background-color: ${shantytown.fieldType.color}`
                            "
                            class="h-4 w-4 mr-2 rounded"
                        />

                        <span>{{ shantytown.fieldType.label }}</span>
                    </div>
                    <div class="mt-2">
                        {{ shantytown.statusName }} depuis le
                        {{ formatDate(shantytown.statusDate, "d/m/y") }}
                        <br />{{ shantytown.statusSince }}
                    </div>
                </div>

                <div>
                    <div
                        v-if="shantytown.populationTotal === null"
                        class="font-bold"
                    >
                        Population inconnue
                    </div>
                    <div v-else class="font-bold">
                        {{ shantytown.populationTotal }} personnes
                    </div>
                    <div
                        class="mt-2"
                        v-for="origin in shantytown.socialOrigins"
                        :key="origin.id"
                    >
                        {{ origin.label }}
                    </div>
                </div>

                <div>
                    <div
                        v-if="shantytown.justiceStatus === null"
                        class="secondary"
                    >
                        Aucune procédure judiciaire en cours
                    </div>
                    <ul v-else class="md:list-disc">
                        <li
                            v-for="status in shantytown.justiceStatuses"
                            :key="status.label"
                        >
                            {{ status.label }}
                            <span v-if="status.date" class="secondary"
                                ><br />le
                                {{ formatDate(status.date, "d/m/y") }}</span
                            >
                        </li>
                    </ul>
                </div>

                <div>
                    <TownCardIcon :value="shantytown.accessToWater" class="mb-1"
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
                </div>
            </div>
            <div class="border-t flex justify-between items-center px-4 py-1">
                <div class="text-sm flex items-center uppercase">
                    <div class="rounded-full bg-corail h-3 w-3 mr-2" />
                    Mis à jour le
                    {{ formatDate(shantytown.updatedAt, "d/m/y") }}
                </div>
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
        </router-link>
    </div>
</template>

<script>
import TownCardIcon from "./TownCardIcon";

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
        }
    }
};
</script>

<style>
.cardShadow {
    box-shadow: 0px 0px 10px #74715f33;
}
</style>
