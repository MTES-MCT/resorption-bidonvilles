<template>
    <TownDetailsPanel>
        <template v-slot:title>Caractéristiques du site</template>
        <template v-slot:body>
            <div class="flex">
                <div class="w-1/2 pr-8">
                    <TownDetailsPanelSection>
                        <div class="grid grid-cols-2">
                            <div>
                                <div class="font-bold">
                                    Installé depuis
                                </div>
                                <div v-if="town.builtAt">
                                    <div>
                                        {{ formatDateSince(town.builtAt) }}
                                    </div>
                                    <div data-cy-data="built_at">
                                        {{ buildAt }}
                                    </div>
                                </div>
                                <div v-else data-cy-data="built_at">
                                    non communiquée
                                </div>
                            </div>
                            <div>
                                <div class="font-bold">
                                    Signalé depuis
                                </div>
                                <div v-if="town.declaredAt">
                                    <div>
                                        {{ formatDateSince(town.declaredAt) }}
                                    </div>
                                    <div data-cy-data="declared_at">
                                        {{ declaredAt }}
                                    </div>
                                </div>
                                <div v-else data-cy-data="declared_at">
                                    non communiquée
                                </div>
                            </div>
                        </div>
                    </TownDetailsPanelSection>

                    <TownDetailsPanelSection>
                        <div class="grid grid-cols-2">
                            <div class="font-bold">
                                Type de site
                            </div>
                            <div
                                class="flex items-center"
                                data-cy-data="field_type"
                            >
                                <Icon
                                    icon="map-marker-alt"
                                    class="text-lg mr-2"
                                    :style="`color: ${town.fieldType.color}`"
                                />
                                {{ town.fieldType.label }}
                            </div>
                        </div>
                    </TownDetailsPanelSection>
                    <TownDetailsPanelSection v-if="town.addressDetails">
                        <div class="grid grid-cols-2">
                            <div class="font-bold">
                                Informations d'accès
                            </div>
                            <div data-cy-data="address_details">
                                {{ town.addressDetails }}
                            </div>
                        </div>
                    </TownDetailsPanelSection>
                    <TownDetailsPanelSection>
                        <div class="font-bold">
                            Coordonnées GPS
                        </div>
                        <div data-cy-data="address_gps">
                            Lat {{ town.latitude }}, Long
                            {{ town.longitude }}
                        </div>
                        <div>
                            <Button
                                variant="primaryText"
                                icon="copy"
                                iconPosition="left"
                                @click="copyCoordinates"
                                href="#"
                                :padding="false"
                                >Copier</Button
                            >
                        </div>
                    </TownDetailsPanelSection>
                    <TownDetailsPanelSection>
                        <div class="grid grid-cols-2">
                            <div class="font-bold">
                                Propriétaire
                            </div>
                            <div data-cy-data="owner_type">
                                {{ town.ownerType.label }}
                            </div>
                        </div>
                    </TownDetailsPanelSection>
                    <TownDetailsPanelSection
                        v-if="town.ownerType.label !== 'Inconnu'"
                    >
                        <div class="grid grid-cols-2">
                            <div class="font-bold">
                                Nom du propriétaire
                            </div>
                            <div data-cy-data="owner">
                                {{ town.owner || "non communiqué" }}
                            </div>
                        </div>
                    </TownDetailsPanelSection>
                    <TownDetailsPanelSection v-if="nearbyTowns.length">
                        <div class="grid grid-cols-2">
                            <div>
                                <div class="font-bold">
                                    Sites à proximité
                                </div>
                                <div class="text-sm text-G600">
                                    Dans un rayon de 500m
                                </div>
                            </div>
                            <div>
                                <ul class="list-disc ml-4">
                                    <li
                                        class="text-sm mb-1"
                                        :key="town.shantytown_id"
                                        v-for="town in nearbyTowns.slice(0, 5)"
                                    >
                                        <router-link
                                            class="link"
                                            :to="`/site/${town.shantytown_id}`"
                                        >
                                            {{
                                                town.address_simple ||
                                                    town.address
                                            }}
                                            <span v-if="town.name"
                                                >« {{ town.name }} »</span
                                            >
                                            <span>
                                                ({{
                                                    town.distance.toFixed(2)
                                                }}km)</span
                                            >
                                        </router-link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </TownDetailsPanelSection>
                </div>
                <div class="w-1/2">
                    <div class="v1">
                        <Map
                            :display-searchbar="false"
                            :towns="[
                                {
                                    ...town,
                                    style: `opacity: 1; z-index: 99999`
                                },
                                ...nearbyTowns.map(t => ({
                                    ...t,
                                    style: `opacity: 0.7`
                                }))
                            ]"
                            :default-view="center"
                            :load-territory-layers="false"
                            @town-click="goTo"
                            layer-name="Satellite"
                        ></Map>
                    </div>
                </div>
            </div>
        </template>
    </TownDetailsPanel>
</template>

<script>
import TownDetailsPanel from "./ui/TownDetailsPanel.vue";
import Map from "#app/components/map/map.vue";
import TownDetailsPanelSection from "./ui/TownDetailsPanelSection.vue";
import formatDateSince from "../TownsList/formatDateSince";
import { notify } from "#helpers/notificationHelper";
import { findNearby } from "#helpers/api/town";

export default {
    props: {
        town: {
            type: Object
        }
    },
    data() {
        return {
            nearbyTowns: []
        };
    },
    components: { TownDetailsPanel, TownDetailsPanelSection, Map },
    methods: {
        goTo(town) {
            if (town.shantytown_id) {
                this.$router.push(`/site/${town.shantytown_id}`);
            }
        },
        /**
         * @see index.js
         */
        formatDate(...args) {
            return window.App.formatDate.apply(window, args);
        },
        formatDateSince,
        copyCoordinates() {
            const input = document.createElement("input");
            input.value = `${this.town.latitude},${this.town.longitude}`;
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            document.body.removeChild(input);

            notify({
                group: "notifications",
                type: "success",
                title: "Succès",
                text: "Les coordonnées ont été copiées dans le presse-papier"
            });
        }
    },
    async created() {
        try {
            const { towns } = await findNearby(
                this.town.latitude,
                this.town.longitude
            );

            this.nearbyTowns = towns.filter(
                town => town.shantytown_id !== this.town.id
            );
            // eslint-disable-next-line no-empty
        } catch (err) {}
    },
    computed: {
        buildAt() {
            return new Date(this.town.builtAt * 1000).toLocaleDateString(
                "fr-FR",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            );
        },
        declaredAt() {
            return new Date(this.town.declaredAt * 1000).toLocaleDateString(
                "fr-FR",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            );
        },
        center() {
            return {
                center: [this.town.latitude, this.town.longitude],
                zoom: 15
            };
        }
    }
};
</script>
