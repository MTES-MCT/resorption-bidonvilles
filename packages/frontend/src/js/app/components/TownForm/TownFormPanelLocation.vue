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
import { findNearby, findClosedNearby } from "#helpers/api/town";

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
        }
    },

    data() {
        return {
            input: this.value,
            nearbyShantytowns: []
        };
    },

    methods: {
        onAddressChange(coordinates) {
            this.input.coordinates = coordinates;
        }
    },
    watch: {
        "input.address": async function() {
            this.nearbyShantytowns = [];
        },
        "input.coordinates": async function() {
            const latitude = this.input.coordinates[0];
            const longitude = this.input.coordinates[1];
            this.$emit("shareClosedTowns", []);
            try {
                const { towns } = await findNearby(latitude, longitude);
                const { closedTowns } = await findClosedNearby(
                    latitude,
                    longitude
                );
                this.nearbyShantytowns = towns;
                this.$emit("shareClosedTowns", closedTowns);
                // eslint-disable-next-line no-empty
            } catch (err) {}
        }
    }
};
</script>
