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

        <FormParagraph title="Quel est le statut du diagnostic social ?">
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
    </FormGroup>
</template>

<script>
import InputPopulation from "./inputs/InputPopulation.vue";
import InputPopulationMinors from "./inputs/InputPopulationMinors.vue";
import InputSocialOrigins from "./inputs/InputSocialOrigins.vue";
import InputCensusStatus from "./inputs/InputCensusStatus.vue";
import InputCensusConductedAt from "./inputs/InputCensusConductedAt.vue";
import InputCensusConductedBy from "./inputs/InputCensusConductedBy.vue";

export default {
    components: {
        InputPopulation,
        InputPopulationMinors,
        InputSocialOrigins,
        InputCensusStatus,
        InputCensusConductedAt,
        InputCensusConductedBy
    },

    props: {
        value: {
            type: Object,
            required: true
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
        }
    }
};
</script>
