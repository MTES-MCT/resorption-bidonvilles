<template>
    <FormGroup title="Équipe">
        <InputEtp v-model="input" validationName="Équipe" id="etp" />
    </FormGroup>
</template>

<script>
import InputEtp from "#app/components/InputEtp/InputEtp.vue";

export default {
    props: {
        value: {
            type: Array,
            required: false,
            default() {
                return [];
            }
        }
    },

    components: {
        InputEtp
    },

    data() {
        return {
            input: this.value
        };
    }
};
</script>
