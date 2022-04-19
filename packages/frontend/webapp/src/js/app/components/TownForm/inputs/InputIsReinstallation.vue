<template>
    <CheckableGroup
        label=" "
        direction="horizontal"
        id="is_reinstallation"
        validationName="S'agit-il d'une réinstallation ?"
        rules="required"
        :withoutMargin="true"
    >
        <Radio
            variant="card"
            label="Oui"
            v-model="checked"
            :checkValue="1"
            cypressName="is_reinstallation"
        ></Radio>
        <Radio
            variant="card"
            label="Non"
            v-model="checked"
            :checkValue="0"
            cypressName="is_reinstallation"
        ></Radio>
        <Radio
            variant="card"
            label="Inconnu"
            v-model="checked"
            :checkValue="-1"
            cypressName="is_reinstallation"
        ></Radio>
    </CheckableGroup>
</template>

<script>
export default {
    props: {
        value: {
            type: Number,
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
