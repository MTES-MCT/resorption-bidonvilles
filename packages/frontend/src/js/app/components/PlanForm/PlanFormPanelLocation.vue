<template>
    <FormGroup title="Lieu">
        <FormParagraph
            title="Dans quel cadre le dispositif se déroule-t-il ?"
            :showMandatoryStar="true"
        >
            <InputLocationType
                v-model="input.location_type"
            ></InputLocationType>

            <InputLocationShantytowns
                v-if="input.location_type === 'shantytowns'"
                v-model="input.location_shantytowns"
            />

            <InputLocationAddress
                v-if="input.location_type === 'location'"
                v-model="input.location_address"
            />

            <InputLocationDetails
                v-if="input.location_type === 'other'"
                v-model="input.location_details"
            />
        </FormParagraph>
    </FormGroup>
</template>

<script>
import InputLocationType from "./inputs/InputLocationType.vue";
import InputLocationShantytowns from "./inputs/InputLocationShantytowns.vue";
import InputLocationAddress from "./inputs/InputLocationAddress.vue";
import InputLocationDetails from "./inputs/InputLocationDetails.vue";

export default {
    props: {
        value: {
            type: Object,
            required: true
        }
    },

    components: {
        InputLocationType,
        InputLocationShantytowns,
        InputLocationAddress,
        InputLocationDetails
    },

    data() {
        return {
            input: this.value
        };
    }
};
</script>
