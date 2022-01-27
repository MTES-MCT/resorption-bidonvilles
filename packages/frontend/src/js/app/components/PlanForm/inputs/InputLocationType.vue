<template>
    <CheckableGroup
        label=""
        id="location_type"
        validationName="Cadre du dispositif"
        rules="required"
    >
        <Radio
            variant="card"
            label="Sur site(s) : bidonville ou squat"
            v-model="checked"
            checkValue="shantytowns"
        ></Radio>
        <Radio
            variant="card"
            label="Sur terrain d'insertion"
            v-model="checked"
            checkValue="location"
        ></Radio>
        <Radio
            variant="card"
            label="Dans le logement"
            v-model="checked"
            checkValue="housing"
        ></Radio>
        <Radio
            variant="card"
            label="Dans plusieurs lieux (hébergement, permanence, rue...)"
            v-model="checked"
            checkValue="other"
        ></Radio>
    </CheckableGroup>
</template>

<script>
export default {
    props: {
        value: {
            type: String,
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
