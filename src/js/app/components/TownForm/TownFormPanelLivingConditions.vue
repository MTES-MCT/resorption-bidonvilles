<template>
    <FormGroup title="Conditions de vie et environnement">
        <FormParagraph title="Les habitants ont-ils accès à l'eau ?">
            <InputAccessToWater
                v-model="input.access_to_water"
            ></InputAccessToWater>
            <InputWaterComments
                v-model="input.water_comments"
            ></InputWaterComments>
        </FormParagraph>

        <FormParagraph title="Les habitants ont-ils accès à l'électricité ?">
            <InputElectricityType
                v-model="input.electricity_type"
            ></InputElectricityType>
            <InputElectricityComments
                v-model="input.electricity_comments"
            ></InputElectricityComments>
        </FormParagraph>

        <FormParagraph title="Les habitants ont-ils accès à des toilettes ?">
            <InputAccessToSanitary
                v-model="input.access_to_sanitary"
            ></InputAccessToSanitary>
            <InputSanitaryComments
                v-model="input.sanitary_comments"
            ></InputSanitaryComments>
        </FormParagraph>

        <FormParagraph title="L'évacuation des déchets est-elle organisée ?">
            <InputTrashEvacuation
                v-model="input.trash_evacuation"
            ></InputTrashEvacuation>
        </FormParagraph>
    </FormGroup>
</template>

<script>
import InputAccessToWater from "./inputs/InputAccessToWater.vue";
import InputWaterComments from "./inputs/InputWaterComments.vue";
import InputElectricityType from "./inputs/InputElectricityType.vue";
import InputElectricityComments from "./inputs/InputElectricityComments.vue";
import InputAccessToSanitary from "./inputs/InputAccessToSanitary.vue";
import InputSanitaryComments from "./inputs/InputSanitaryComments.vue";
import InputTrashEvacuation from "./inputs/InputTrashEvacuation.vue";

export default {
    components: {
        InputAccessToWater,
        InputWaterComments,
        InputElectricityType,
        InputElectricityComments,
        InputAccessToSanitary,
        InputSanitaryComments,
        InputTrashEvacuation
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
    }
};
</script>
