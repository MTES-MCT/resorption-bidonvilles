<template>
    <FormGroup title="Santé">
        <FormParagraph title="Nombre de personnes...">
            <FormParagraph title="ayant une couverture valide..." size="lg">
                <div class="flex">
                    <InputAmeValide v-model="input.ame_valide" />
                    <InputPumaValide class="ml-4" v-model="input.puma_valide" />
                </div>
            </FormParagraph>

            <FormParagraph title="ayant une demande en cours..." size="lg">
                <div class="flex">
                    <InputAmeEncours v-model="input.ame_en_cours" />
                    <InputPumaEnCours
                        class="ml-4"
                        v-model="input.puma_en_cours"
                    />
                </div>
            </FormParagraph>
        </FormParagraph>

        <FormParagraph
            title="Nombre de personnes ayant fait l'objet d'au moins..."
        >
            <InputOrientation v-model="input.orientation" />
            <InputAccompagnement v-model="input.accompagnement" />
        </FormParagraph>
    </FormGroup>
</template>

<script>
import InputAmeValide from "./inputs/InputAmeValide.vue";
import InputPumaValide from "./inputs/InputPumaValide.vue";
import InputAmeEncours from "./inputs/InputAmeEnCours.vue";
import InputPumaEnCours from "./inputs/InputPumaEnCours.vue";
import InputOrientation from "./inputs/InputOrientation.vue";
import InputAccompagnement from "./inputs/InputAccompagnement.vue";

export default {
    props: {
        value: {
            type: Object,
            required: true
        }
    },

    components: {
        InputAmeValide,
        InputPumaValide,
        InputAmeEncours,
        InputPumaEnCours,
        InputOrientation,
        InputAccompagnement
    },

    data() {
        return {
            input: this.value
        };
    }
};
</script>
