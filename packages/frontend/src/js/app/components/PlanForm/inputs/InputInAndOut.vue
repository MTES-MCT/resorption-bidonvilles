<template>
    <CheckableGroup
        label="Cette action implique-t-elle un système d'entrées et de sorties des personnes ?"
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
            :disabled="disabled"
        ></Radio>
        <Radio
            variant="card"
            label="Non"
            v-model="checked"
            :checkValue="false"
            :disabled="disabled"
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
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false
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
