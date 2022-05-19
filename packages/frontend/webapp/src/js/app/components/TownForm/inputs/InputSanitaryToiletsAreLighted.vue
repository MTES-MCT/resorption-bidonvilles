<template>
    <CheckableGroup
        id="sanitary_toilets_are_lighted"
        label="Ces toilettes sont-elles éclairées et verrouillables de l’intérieur ?"
        direction="horizontal"
        rules="required"
    >
        <Radio
            variant="card"
            label="Oui"
            v-model="checked"
            :checkValue="1"
            cypressName="toilets_are_lighted"
        ></Radio>
        <Radio
            variant="card"
            label="Non"
            v-model="checked"
            :checkValue="0"
            cypressName="toilets_are_lighted"
        ></Radio>
        <Radio
            variant="card"
            label="Inconnu"
            v-model="checked"
            :checkValue="-1"
            cypressName="toilets_are_lighted"
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
