<template>
    <div class="bg-gray-200 flex">
        <div class="p-5 flex-grow">
            <FormParagraph title="Adresse" :showMandatoryStar="true">
                <InputAddress
                    v-model="input.address"
                    @change="onAddressChange"
                ></InputAddress>
            </FormParagraph>
            <div class="text-sm mb-4 max-w-lg" v-if="nearbyShantytowns.length">
                <span v-if="nearbyShantytowns.length === 1"
                    >1 site enregistré</span
                >
                <span v-else
                    >{{ nearbyShantytowns.length }} sites sont enregistrés</span
                >
                <span>
                    dans un rayon de 500 mètres autour de cette adresse.
                    Assurez-vous de ne pas déclarer un site déjà enregistré sur
                    la plateforme:</span
                >
                <ul class="list-disc ml-4">
                    <li
                        :key="town.id"
                        v-for="town in nearbyShantytowns.slice(0, 5)"
                    >
                        <router-link class="link" :to="`/site/${town.id}`">
                            {{ town.usename }}
                            <span> ({{ town.distance.toFixed(2) }}km)</span>
                        </router-link>
                    </li>
                </ul>
            </div>
            <FormParagraph title="Appellation du site">
                <InputName v-model="input.name"></InputName>
            </FormParagraph>
        </div>

        <div class="w-96 h-96" v-if="input.address.label">
            <InputCoordinates v-model="input.coordinates"></InputCoordinates>
        </div>
    </div>
</template>

<script>
import InputAddress from "./inputs/InputAddress.vue";
import InputName from "./inputs/InputName.vue";
import InputCoordinates from "./inputs/InputCoordinates.vue";
import { findNearby } from "#helpers/api/town";
import { getDepartementForCity } from "#helpers/api/geo";
import { mapGetters } from "vuex";

export default {
    components: {
        InputAddress,
        InputName,
        InputCoordinates
    },

    props: {
        value: {
            type: Object,
            required: true
        },
        declaredAt: {
            type: Date,
            required: true
        }
    },

    data() {
        return {
            input: this.value,
            nearbyShantytowns: []
        };
    },

    methods: {
        onAddressChange(townInfos) {
            const [lat, lng, citycode] = townInfos
                ? townInfos
                : [null, null, null];
            this.input.coordinates = [lat, lng];
            this.input.citycode = citycode;
        },
        load() {
            if (!this.shantytowns.length) {
                this.$store.dispatch("fetchTowns");
            }
        },
        isEmptyObject(value) {
            return (
                Object.prototype.toString.call(value) === "[object Object]" &&
                JSON.stringify(value) === "{}"
            );
        }
    },
    created() {
        this.load();
    },
    computed: {
        ...mapGetters({
            shantytowns: "towns",
            townsLoading: "townsLoading"
        })
    },
    watch: {
        "input.address": async function() {
            this.nearbyShantytowns = [];
            this.$emit(
                "noAddressEntered",
                this.isEmptyObject(this.input.address)
            );
        },
        "input.coordinates": async function() {
            if (this.input.coordinates) {
                const latitude = this.input.coordinates[0];
                const longitude = this.input.coordinates[1];
                const citycode = this.input.citycode;
                this.$emit("shareClosedTowns", []);
                try {
                    // Pour l'affichage des sites enregistrés dans un rayon de 500 mètres autour de cette adresse.
                    const { towns } = await findNearby(latitude, longitude);
                    this.nearbyShantytowns = towns;

                    // Recherche des sites fermés jusqu'à 90 jours avant la date de déclaration du site en cours de saisie
                    // Recherche du code du département dans lequel se situe le site déclaré
                    const { departement } = await getDepartementForCity(
                        citycode
                    );

                    const closedTowns = this.shantytowns.filter(
                        town =>
                            // town.statusName === "Fermé" &&
                            // town.closedAt &&
                            town.departement.code === departement.code &&
                            Math.ceil(
                                (new Date(this.declaredAt).getTime() -
                                    town.closedAt * 1000) /
                                    (1000 * 3600 * 24)
                            ) < 90 &&
                            Math.ceil(
                                (new Date(this.declaredAt).getTime() -
                                    town.closedAt * 1000) /
                                    (1000 * 3600 * 24)
                            ) > 0
                    );
                    closedTowns.sort((a, b) => {
                        return b.closedAt - a.closedAt;
                    });
                    this.$emit("shareClosedTowns", closedTowns);
                    // eslint-disable-next-line no-empty
                } catch (err) {}
            }
        }
    }
};
</script>
