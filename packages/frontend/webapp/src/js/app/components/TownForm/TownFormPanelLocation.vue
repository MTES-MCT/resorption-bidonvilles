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
import { findNearby, findClosedTowns } from "#helpers/api/town";
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
        isEmptyObject(value) {
            return (
                Object.prototype.toString.call(value) === "[object Object]" &&
                JSON.stringify(value) === "{}"
            );
        },
        formatDate(d) {
            if (!d || !(d instanceof Date)) {
                return d;
            }

            const year = d.getFullYear();
            const month = `${d.getMonth() + 1}`.padStart(2, "0");
            const day = `${d.getDate()}`.padStart(2, "0");

            return `${year}-${month}-${day}`;
        }
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

                    // Pour la réinstallation: choix des sites fermés dans le département dans les 90 jours
                    const { closedTowns } = await findClosedTowns(
                        citycode,
                        this.formatDate(this.declaredAt)
                    );
                    this.$emit("shareClosedTowns", closedTowns);
                    // eslint-disable-next-line no-empty
                } catch (err) {}
            }
        }
    }
};
</script>
