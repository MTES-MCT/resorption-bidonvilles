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
            <InputLocationClosedShantytowns
                v-if="isReinstallationInCreationMode"
                v-model="input.location_shantytowns"
                :nearbyClosedShantytowns="closedShantytowns"
            >
            </InputLocationClosedShantytowns>
        </FormParagraph>
        <div class="mt-6" v-if="input.is_reinstallation === 1">
            <InputReinstallationComments
                v-if="input.is_reinstallation === 1"
                v-model="input.reinstallation_comments"
            ></InputReinstallationComments>
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
            return this.input.is_reinstallation && this.mode === "create";
        }
    }
};
</script>
