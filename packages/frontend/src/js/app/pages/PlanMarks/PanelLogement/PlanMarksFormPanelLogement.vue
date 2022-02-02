<template>
    <FormGroup title="Logement">
        <FormParagraph title="Nombre de demandes">
            <FormParagraph title="SIAO" size="lg">
                <div class="flex">
                    <InputSiaoFamilies v-model="input.siao.families" />
                    <InputSiaoPeople class="ml-4" v-model="input.siao.people" />
                </div>
            </FormParagraph>

            <FormParagraph title="de logements sociaux" size="lg">
                <div class="flex">
                    <InputLogementSocialFamilies
                        v-model="input.logement_social.families"
                    />
                    <InputLogementSocialPeople
                        class="ml-4"
                        v-model="input.logement_social.people"
                    />
                </div>
            </FormParagraph>

            <FormParagraph title="DALO" size="lg">
                <div class="flex">
                    <InputDaloFamilies v-model="input.dalo.families" />
                    <InputDaloPeople class="ml-4" v-model="input.dalo.people" />
                </div>
            </FormParagraph>
        </FormParagraph>

        <FormParagraph title="Nombre d'accès à...">
            <FormParagraph title="un logement, accompagné / adapté" size="lg">
                <div class="flex">
                    <InputAccompagnesFamilies
                        v-model="input.accompagnes.families"
                    />
                    <InputAccompagnesPeople
                        class="ml-4"
                        v-model="input.accompagnes.people"
                    />
                </div>
            </FormParagraph>

            <FormParagraph title="un logement, sans accompagnement" size="lg">
                <div class="flex">
                    <InputNonAccompagnesFamilies
                        v-model="input.non_accompagnes.families"
                    />
                    <InputNonAccompagnesPeople
                        class="ml-4"
                        v-model="input.non_accompagnes.people"
                    />
                </div>
            </FormParagraph>

            <FormParagraph title="un hébergement" size="lg">
                <div class="flex">
                    <InputHebergesFamilies v-model="input.heberges.families" />
                    <InputHebergesPeople
                        class="ml-4"
                        v-model="input.heberges.people"
                    />
                </div>
            </FormParagraph>
        </FormParagraph>
    </FormGroup>
</template>

<script>
import InputSiaoFamilies from "./inputs/InputSiaoFamilies.vue";
import InputSiaoPeople from "./inputs/InputSiaoPeople.vue";
import InputLogementSocialFamilies from "./inputs/InputLogementSocialFamilies.vue";
import InputLogementSocialPeople from "./inputs/InputLogementSocialPeople.vue";
import InputDaloFamilies from "./inputs/InputDaloFamilies.vue";
import InputDaloPeople from "./inputs/InputDaloPeople.vue";
import InputAccompagnesFamilies from "./inputs/InputAccompagnesFamilies.vue";
import InputAccompagnesPeople from "./inputs/InputAccompagnesPeople.vue";
import InputNonAccompagnesFamilies from "./inputs/InputNonAccompagnesFamilies.vue";
import InputNonAccompagnesPeople from "./inputs/InputNonAccompagnesPeople.vue";
import InputHebergesFamilies from "./inputs/InputHebergesFamilies.vue";
import InputHebergesPeople from "./inputs/InputHebergesPeople.vue";

export default {
    props: {
        value: {
            type: Object,
            required: true
        }
    },

    components: {
        InputSiaoFamilies,
        InputSiaoPeople,
        InputLogementSocialFamilies,
        InputLogementSocialPeople,
        InputDaloFamilies,
        InputDaloPeople,
        InputAccompagnesFamilies,
        InputAccompagnesPeople,
        InputNonAccompagnesFamilies,
        InputNonAccompagnesPeople,
        InputHebergesFamilies,
        InputHebergesPeople
    },

    data() {
        return {
            input: this.value
        };
    }
};
</script>
