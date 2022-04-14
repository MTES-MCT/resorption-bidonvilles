<template>
    <FormGroup title="Éducation et scolarisation">
        <InputScolarisables v-model="input.scolarisables" />
        <InputEnMediation v-model="input.en_mediation" />

        <FormParagraph title="Nombre d'enfants inscrits en...">
            <div class="flex">
                <InputMaternelles v-model="input.maternelles" />
                <InputElementaires class="ml-4" v-model="input.elementaires" />
                <InputColleges class="ml-4" v-model="input.colleges" />
                <InputLycees class="ml-4" v-model="input.lycees" />
            </div>
        </FormParagraph>

        <InputDifficultes v-model="input.difficultes" />
    </FormGroup>
</template>

<script>
import InputScolarisables from "./inputs/InputScolarisables.vue";
import InputEnMediation from "./inputs/InputEnMediation.vue";
import InputMaternelles from "./inputs/InputMaternelles.vue";
import InputElementaires from "./inputs/InputElementaires.vue";
import InputColleges from "./inputs/InputColleges.vue";
import InputLycees from "./inputs/InputLycees.vue";
import InputDifficultes from "./inputs/InputDifficultes.vue";

export default {
    props: {
        value: {
            type: Object,
            required: true
        }
    },

    components: {
        InputScolarisables,
        InputEnMediation,
        InputMaternelles,
        InputElementaires,
        InputColleges,
        InputLycees,
        InputDifficultes
    },

    data() {
        return {
            input: this.value
        };
    }
};
</script>
