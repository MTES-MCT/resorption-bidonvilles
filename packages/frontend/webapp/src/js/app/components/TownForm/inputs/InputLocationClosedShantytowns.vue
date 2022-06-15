<template>
    <InputClosedShantytowns
        id="location_shantytowns"
        :nearbyClosedShantytowns="nearbyClosedShantytowns"
        validationName="Sites fermés concernés"
        :showMandatoryStar="true"
        rules="required"
        :disabled="disabled"
        v-model="input"
        :defaultTab="defaultTab"
    >
        <template v-slot:info>
            <span v-if="nearbyClosedShantytowns.length === 1">
                1 site a été fermé
            </span>
            <span v-else>
                {{ nearbyClosedShantytowns.length }} sites ont été fermés
            </span>
            <span>
                dans le département correspondant à cette adresse durant les 90
                jours précédents la date de déclaration du site. Si la
                déclaration actuelle correspond à la réouverture de l'un de ces
                sites, merci de le cocher afin qu'il soit automatiquement ajouté
                en commentaire.
            </span>
        </template>
    </InputClosedShantytowns>
</template>

<script>
import InputClosedShantytowns from "#app/components/InputClosedShantytowns/InputClosedShantytowns.vue";

export default {
    props: {
        nearbyClosedShantytowns: {
            type: Array
        },
        value: {
            type: Array,
            required: false,
            default() {
                return [];
            }
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false
        },
        defaultTab: {
            type: String,
            required: false,
            default: "closed"
        }
    },

    components: {
        InputClosedShantytowns
    },

    computed: {
        displayClosedShantytowns() {
            return this.nearbyClosedShantytowns;
        }
    },

    data() {
        return {
            input: this.value
        };
    },

    watch: {
        value() {
            this.input = this.value;
        },

        input() {
            this.$emit("input", this.input);
        }
    }
};
</script>
