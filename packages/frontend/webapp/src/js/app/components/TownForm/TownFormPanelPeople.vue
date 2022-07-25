<template>
    <FormGroup title="Habitants">
        <FormParagraph title="Combien d'habitants vivent sur le site ?">
            <InputPopulation v-model="input.population"></InputPopulation>
            <InputPopulationMinors
                v-model="input.populationMinors"
            ></InputPopulationMinors>
        </FormParagraph>

        <FormParagraph title="Quelle est l'origine des habitants ?">
            <InputSocialOrigins
                v-model="input.social_origins"
            ></InputSocialOrigins>
        </FormParagraph>

        <FormParagraph
            title="Combien y a-t-il de caravanes et de de cabanes sur le site ?"
        >
            <InputCaravansAndHuts v-model="input.caravansAndHuts">
            </InputCaravansAndHuts>
        </FormParagraph>

        <FormParagraph
            title="Quel est le statut du diagnostic social ?"
            :showMandatoryStar="true"
        >
            <InputCensusStatus
                v-model="input.census_status"
                ref="censusStatus"
            ></InputCensusStatus>
            <div class="w-64" v-if="!censusStatusIsUnknown">
                <InputCensusConductedAt
                    v-model="input.census_conducted_at"
                ></InputCensusConductedAt>
            </div>
            <InputCensusConductedBy
                v-if="!censusStatusIsUnknown"
                v-model="input.census_conducted_by"
            ></InputCensusConductedBy>
        </FormParagraph>
        <FormParagraph
            title="Tout ou partie des habitants viennent-ils d'un ou de plusieurs sites récemment fermés ?"
            :showMandatoryStar="true"
        >
            <span class="mb-8">
                La majorité des habitants était déjà sur le territoire.
            </span>
            <InputIsReinstallation
                v-model="input.is_reinstallation"
            ></InputIsReinstallation>
            <transition name="fade">
                <div
                    class="italic text-sm"
                    v-if="isReinstallationButNoAddressProvided"
                >
                    Veuillez saisir une adresse pour que nous puissions vous
                    afficher la liste des sites fermés ces trois derniers mois
                    dans le département.
                </div>
            </transition>
            <transition name="fade">
                <InputLocationClosedShantytowns
                    v-if="isReinstallationInCreationMode"
                    v-model="input.location_shantytowns"
                    :nearbyClosedShantytowns="closedShantytowns"
                >
                </InputLocationClosedShantytowns>
            </transition>
        </FormParagraph>
        <div class="mt-6" v-if="input.is_reinstallation === 1">
            <transition name="fade">
                <InputReinstallationComments
                    v-if="input.is_reinstallation === 1"
                    v-model="input.reinstallation_comments"
                ></InputReinstallationComments>
            </transition>
        </div>
    </FormGroup>
</template>

<script>
import InputPopulation from "./inputs/InputPopulation.vue";
import InputPopulationMinors from "./inputs/InputPopulationMinors.vue";
import InputSocialOrigins from "./inputs/InputSocialOrigins.vue";
import InputCaravansAndHuts from "./inputs/InputCaravansAndHuts.vue";
import InputCensusStatus from "./inputs/InputCensusStatus.vue";
import InputCensusConductedAt from "./inputs/InputCensusConductedAt.vue";
import InputCensusConductedBy from "./inputs/InputCensusConductedBy.vue";
import InputIsReinstallation from "./inputs/InputIsReinstallation.vue";
import InputReinstallationComments from "./inputs/InputReinstallationComments.vue";
import InputLocationClosedShantytowns from "./inputs/InputLocationClosedShantytowns.vue";

export default {
    components: {
        InputPopulation,
        InputPopulationMinors,
        InputSocialOrigins,
        InputCaravansAndHuts,
        InputCensusStatus,
        InputCensusConductedAt,
        InputCensusConductedBy,
        InputIsReinstallation,
        InputReinstallationComments,
        InputLocationClosedShantytowns
    },

    props: {
        value: {
            type: Object,
            required: true
        },
        nearbyClosedShantytowns: {
            type: Array
        },
        mode: {
            type: String
        },
        noAddressProvided: {
            type: Boolean
        }
    },

    data() {
        return {
            input: this.value
        };
    },
    computed: {
        censusStatusIsUnknown() {
            const value = this.input.census_status;
            return value !== "scheduled" && value !== "done";
        },
        closedShantytowns() {
            return this.nearbyClosedShantytowns;
        },
        isReinstallationInCreationMode() {
            return (
                this.input.is_reinstallation === 1 &&
                this.mode === "create" &&
                !this.noAddressProvided
                // Ne pas supprimer: sera utile pour la v2 du ticket
                // this.input.is_reinstallation === 1 &&
                // (this.mode === "create" || this.mode === "update")
            );
        },
        isReinstallationButNoAddressProvided() {
            return this.input.is_reinstallation === 1 && this.noAddressProvided;
        },
        displayInputLocationClosedShantytowns() {
            return (
                this.input.is_reinstallation === 1 &&
                !this.noAddressProvided &&
                this.mode === "create"
            );
        }
    }
};
</script>
<style>
.fade-enter {
    opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease-out;
}
.fade-leave-to {
    opacity: 0;
}
</style>
