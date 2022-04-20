<template>
    <FormGroup title="Stabilisation et sécurisation du site">
        <FormParagraph title="Nombre...">
            <InputPointsEau v-model="input.points_eau" />
            <InputWc v-model="input.wc" />
            <InputElectricite v-model="input.electricite" />
            <InputNombreBennes v-model="input.nombre_bennes" />
        </FormParagraph>
    </FormGroup>
</template>

<script>
import InputPointsEau from "./inputs/InputPointsEau.vue";
import InputWc from "./inputs/InputWc.vue";
import InputElectricite from "./inputs/InputElectricite.vue";
import InputNombreBennes from "./inputs/InputNombreBennes.vue";

export default {
    props: {
        value: {
            type: Object,
            required: true
        }
    },

    components: {
        InputPointsEau,
        InputWc,
        InputElectricite,
        InputNombreBennes
    },

    data() {
        return {
            input: this.value
        };
    }
};
</script>
