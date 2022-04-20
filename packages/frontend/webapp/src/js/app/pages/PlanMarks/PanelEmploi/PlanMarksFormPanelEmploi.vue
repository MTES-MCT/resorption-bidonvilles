<template>
    <FormGroup title="Formation et emploi">
        <FormParagraph title="Nombre de personnes inscrites ou suivies par">
            <FormParagraph title="Pôle Emploi" size="lg">
                <div class="flex items-center">
                    <InputPoleEmploi v-model="input.pole_emploi" />
                    <span class="mx-2">dont</span>
                    <InputPoleEmploiFemmes v-model="input.pole_emploi_femmes" />
                    <span class="ml-2">femmes</span>
                </div>
            </FormParagraph>

            <FormParagraph title="Mission locale" size="lg">
                <div class="flex items-center">
                    <InputMissionLocale v-model="input.mission_locale" />
                    <span class="mx-2">dont</span>
                    <InputMissionLocaleFemmes
                        v-model="input.mission_locale_femmes"
                    />
                    <span class="ml-2">femmes</span>
                </div>
            </FormParagraph>
        </FormParagraph>

        <FormParagraph title="Nombre de personnes ayant">
            <FormParagraph title="un contrat" size="lg">
                <div class="flex items-center">
                    <InputContrats v-model="input.contrats" />
                    <span class="mx-2">dont</span>
                    <InputContratsFemmes v-model="input.contrats_femmes" />
                    <span class="ml-2">femmes</span>
                </div>
            </FormParagraph>

            <FormParagraph title="une formation" size="lg">
                <div class="flex items-center">
                    <InputFormations v-model="input.formations" />
                    <span class="mx-2">dont</span>
                    <InputFormationsFemmes v-model="input.formations_femmes" />
                    <span class="ml-2">femmes</span>
                </div>
            </FormParagraph>

            <FormParagraph title="un statut autoentrepreneur" size="lg">
                <div class="flex items-center">
                    <InputAutoentrepreneurs v-model="input.autoentrepreneurs" />
                    <span class="mx-2">dont</span>
                    <InputAutoentrepreneursFemmes
                        v-model="input.autoentrepreneurs_femmes"
                    />
                    <span class="ml-2">femmes</span>
                </div>
            </FormParagraph>

            <FormParagraph title="l'ARE" size="lg">
                <div class="flex items-center">
                    <InputAre v-model="input.are" />
                    <span class="mx-2">dont</span>
                    <InputAreFemmes v-model="input.are_femmes" />
                    <span class="ml-2">femmes</span>
                </div>
            </FormParagraph>
        </FormParagraph>
    </FormGroup>
</template>

<script>
import InputPoleEmploi from "./inputs/InputPoleEmploi.vue";
import InputPoleEmploiFemmes from "./inputs/InputPoleEmploiFemmes.vue";
import InputMissionLocale from "./inputs/InputMissionLocale.vue";
import InputMissionLocaleFemmes from "./inputs/InputMissionLocaleFemmes.vue";
import InputContrats from "./inputs/InputContrats.vue";
import InputContratsFemmes from "./inputs/InputContratsFemmes.vue";
import InputFormations from "./inputs/InputFormations.vue";
import InputFormationsFemmes from "./inputs/InputFormationsFemmes.vue";
import InputAutoentrepreneurs from "./inputs/InputAutoentrepreneurs.vue";
import InputAutoentrepreneursFemmes from "./inputs/InputAutoentrepreneursFemmes.vue";
import InputAre from "./inputs/InputAre.vue";
import InputAreFemmes from "./inputs/InputAreFemmes.vue";

export default {
    props: {
        value: {
            type: Object,
            required: true
        }
    },

    components: {
        InputPoleEmploi,
        InputPoleEmploiFemmes,
        InputMissionLocale,
        InputMissionLocaleFemmes,
        InputContrats,
        InputContratsFemmes,
        InputAutoentrepreneurs,
        InputAutoentrepreneursFemmes,
        InputAre,
        InputAreFemmes,
        InputFormations,
        InputFormationsFemmes
    },

    data() {
        return {
            input: this.value
        };
    }
};
</script>
