<template>
    <DetailsPanel>
        <template v-slot:title>Caractéristiques du site</template>
        <template v-slot:body>
            <div class="flex">
                <div class="w-1/2 pr-8">
                    <DetailsPanelSection>
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
                    </DetailsPanelSection>

                    <DetailsPanelSection>
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
                    </DetailsPanelSection>
                    <DetailsPanelSection v-if="town.addressDetails">
                        <div class="grid grid-cols-2">
                            <div class="font-bold">
                                Informations d'accès
                            </div>
                            <div data-cy-data="address_details">
                                {{ town.addressDetails }}
                            </div>
                        </div>
                    </DetailsPanelSection>
                    <DetailsPanelSection>
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
                    </DetailsPanelSection>
                    <DetailsPanelSection>
                        <div class="grid grid-cols-2">
                            <div class="font-bold">
                                Propriétaire
                            </div>
                            <div data-cy-data="owner_type">
                                {{ town.ownerType.label }}
                            </div>
                        </div>
                    </DetailsPanelSection>
                    <DetailsPanelSection
                        v-if="
                            town.ownerType.label !== 'Inconnu' &&
                                $store.getters['config/hasPermission'](
                                    'shantytown_owner.access'
                                )
                        "
                    >
                        <div class="grid grid-cols-2">
                            <div class="font-bold">
                                Nom du propriétaire
                            </div>
                            <div data-cy-data="owner">
                                {{ town.owner || "non communiqué" }}
                            </div>
                        </div>
                    </DetailsPanelSection>
                    <DetailsPanelSection v-if="nearbyTowns.length">
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
                                            :to="`/site/${town.id}`"
                                        >
                                            {{ town.usename }}
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
                    </DetailsPanelSection>
                    <DetailsPanelSection>
                        <div class="grid grid-cols-2">
                            <div class="font-bold">
                                S'agit-t-il d'une réinstallation ?
                            </div>
                            <div data-cy-data="is_reinstallation">
                                {{ boolToStr(town.isReinstallation) }}
                            </div>
                        </div>
                    </DetailsPanelSection>
                    <DetailsPanelSection
                        v-if="town.reinstallationComments !== null"
                    >
                        <div class="grid grid-cols-2">
                            <div class="font-bold">
                                Précisions sur la réinstallation
                            </div>
                            <!-- eslint-disable -->
                            <div data-cy-data="reinstallation_comments">{{ town.reinstallationComments }}</div>
                            <!-- eslint-enable -->
                        </div>
                    </DetailsPanelSection>
                </div>
                <div class="w-1/2">
                    <Map
                        :display-searchbar="false"
                        :displayAddressToggler="false"
                        :displayPrinter="false"
                        :towns="[
                            {
                                ...town,
                                style: `opacity: 1`
                            },
                            ...nearbyTowns.map(t => ({
                                ...t,
                                style: `opacity: 0.8`
                            }))
                        ]"
                        :default-view="center"
                        :load-territory-layers="false"
                        :cadastre="cadastre"
                        @town-click="goTo"
                        layer-name="Satellite"
                    ></Map>
                </div>
            </div>
        </template>
    </DetailsPanel>
</template>

<script>
import { generateSquare, getCadastre } from "#helpers/ignHelper";
import Map from "#app/components/map/map.vue";
import DetailsPanel from "#app/components/ui/details/DetailsPanel.vue";
import DetailsPanelSection from "#app/components/ui/details/DetailsPanelSection.vue";
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
            nearbyTowns: [],
            cadastre: null,
            cadastrePromise: null
        };
    },
    components: { DetailsPanel, DetailsPanelSection, Map },
    methods: {
        async loadCadastre() {
            if (this.cadastre !== null || this.cadastrePromise !== null) {
                return;
            }

            try {
                this.cadastrePromise = getCadastre(
                    generateSquare(
                        [this.town.longitude, this.town.latitude],
                        0.06
                    )
                );
                const response = await this.cadastrePromise;

                if (
                    Number.isInteger(response.totalFeatures) &&
                    response.totalFeatures > 0
                ) {
                    this.cadastre = response;
                }
            } catch (error) {
                // ignore
            }

            this.cadastrePromise = null;
        },
        boolToStr(bool) {
            if (bool === null) {
                return "non communiqué";
            }
            return bool ? "Oui" : "Non";
        },
        goTo(town) {
            if (town.id && town.id !== this.town.id) {
                this.$router.push(`/site/${town.id}`);
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
        this.loadCadastre();

        try {
            const { towns } = await findNearby(
                this.town.latitude,
                this.town.longitude
            );

            this.nearbyTowns = towns.filter(town => town.id !== this.town.id);
            // eslint-disable-next-line no-empty
        } catch (err) {}
    },
    beforeDestroy() {
        if (this.cadastrePromise) {
            this.cadastrePromise.abort();
        }
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
