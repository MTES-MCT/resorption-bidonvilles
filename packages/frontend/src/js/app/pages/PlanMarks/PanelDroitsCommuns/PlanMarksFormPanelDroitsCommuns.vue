<template>
    <FormGroup title="Droits communs et ressources">
        <FormParagraph title="Nombre de personnes avec...">
            <InputDomiciliation v-model="input.domiciliation" />
            <InputDroitsCaf v-model="input.droits_caf" />
            <InputEmploiStable v-model="input.emploi_stable" />
        </FormParagraph>
    </FormGroup>
</template>

<script>
import InputDomiciliation from "./inputs/InputDomiciliation.vue";
import InputDroitsCaf from "./inputs/InputDroitsCaf.vue";
import InputEmploiStable from "./inputs/InputEmploiStable.vue";

export default {
    props: {
        value: {
            type: Object,
            required: true
        }
    },

    components: {
        InputDomiciliation,
        InputDroitsCaf,
        InputEmploiStable
    },

    data() {
        return {
            input: this.value
        };
    }
};
</script>
