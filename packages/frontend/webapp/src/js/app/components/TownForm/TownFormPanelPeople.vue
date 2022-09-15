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
            title="Tout ou partie des habitants viennent-ils d'un ou plusieurs sites du territoire ?"
            :showMandatoryStar="true"
        >
            La majorité des habitants était déjà sur le territoire.
            <InputIsReinstallation
                v-model="input.is_reinstallation"
            ></InputIsReinstallation>
        </FormParagraph>
        <div class="ml-12 mt-6" v-if="input.is_reinstallation === 1">
            <InputReinstallationComments
                v-model="input.reinstallation_comments"
            ></InputReinstallationComments>
            <InputShantytowns
                v-if="!!this.reinstallationConfig.departement"
                label="Sélectionnez les sites d'origine des habitants"
                v-model="input.reinstallation_incoming_towns"
                :customFilter="filterIncomingTowns"
                :columns="[
                    'city',
                    'address',
                    'fieldType',
                    'population',
                    'closedAt'
                ]"
            >
                <template slot="info">
                    À l'aide du tableau ci-dessous sélectionnez les sites où
                    vivaient précédemment les habitants du site en cours de
                    saisie. La tableau liste les sites ouverts à date et les
                    sites fermés avant l'installation de celui-ci.</template
                >
            </InputShantytowns>
            <p v-else>
                <InputLabel
                    label="Site(s) d'origine des habitant(e)s"
                    info="Vous pourrez sélectionner ici le ou les sites d'origine des habitant(e)s, une fois le champ Adresse rempli"
                />
            </p>
        </div>
    </FormGroup>
</template>

<script>
import InputLabel from "#app/components/ui/Form/utils/InputLabel.vue";
import InputPopulation from "./inputs/InputPopulation.vue";
import InputPopulationMinors from "./inputs/InputPopulationMinors.vue";
import InputSocialOrigins from "./inputs/InputSocialOrigins.vue";
import InputCaravansAndHuts from "./inputs/InputCaravansAndHuts.vue";
import InputCensusStatus from "./inputs/InputCensusStatus.vue";
import InputCensusConductedAt from "./inputs/InputCensusConductedAt.vue";
import InputCensusConductedBy from "./inputs/InputCensusConductedBy.vue";
import InputIsReinstallation from "./inputs/InputIsReinstallation.vue";
import InputReinstallationComments from "./inputs/InputReinstallationComments.vue";
import InputShantytowns from "#app/components/InputShantytowns/InputShantytowns.vue";

export default {
    components: {
        InputLabel,
        InputPopulation,
        InputPopulationMinors,
        InputSocialOrigins,
        InputCaravansAndHuts,
        InputCensusStatus,
        InputCensusConductedAt,
        InputCensusConductedBy,
        InputIsReinstallation,
        InputReinstallationComments,
        InputShantytowns
    },

    props: {
        value: {
            type: Object,
            required: true
        },
        reinstallationConfig: {
            type: Object,
            required: false,
            default() {
                return {
                    id: null,
                    departement: null,
                    builtAt: null
                };
            }
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
    },

    methods: {
        filterIncomingTowns(town) {
            // on ne conserve que les sites du même département
            if (!this.reinstallationConfig.departement) {
                return false;
            }

            if (
                this.reinstallationConfig.departement.code !==
                town.departement.code
            ) {
                return false;
            }

            // on interdit de s'auto-référencer
            if (
                this.reinstallationConfig.id &&
                town.id === this.reinstallationConfig.id
            ) {
                return false;
            }

            // on ne conserve que les sites ouverts ou les sites fermés 90 jours avant la date
            // d'installation du site courant
            if (town.closedAt === null) {
                return true;
            }

            const max = this.reinstallationConfig.builtAt || new Date();
            max.setHours(0, 0, 0, 0);

            const min = new Date(max);
            min.setDate(min.getDate() - 89);

            return (
                town.closedAt <= max.getTime() / 1000 &&
                town.closedAt >= min.getTime() / 1000
            );
        }
    }
};
</script>
