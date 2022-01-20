<template>
    <CheckableGroup
        label="Ce dispositif implique-t-il un système d'entrées et de sorties des personnes ?"
        direction="horizontal"
        id="in_and_out"
        validationName="Système d'entrée et sorties de personnes"
        rules="required"
        :showMandatoryStar="true"
    >
        <Radio
            variant="card"
            label="Oui"
            v-model="checked"
            :checkValue="true"
        ></Radio>
        <Radio
            variant="card"
            label="Non"
            v-model="checked"
            :checkValue="false"
        ></Radio>
    </CheckableGroup>
</template>

<script>
export default {
    props: {
        value: {
            type: Boolean,
            required: false,
            default: undefined
        }
    },

    data() {
        return {
            checked: this.value
        };
    },

    watch: {
        value() {
            this.checked = this.value;
        },

        checked() {
            this.$emit("input", this.checked);
        }
    }
};
</script>
