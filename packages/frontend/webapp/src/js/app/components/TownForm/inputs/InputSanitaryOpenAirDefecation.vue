<template>
    <CheckableGroup
        id="sanitary_open_air_defecation"
        label="Constate-t-on des marques de défécation à l’air libre ?"
        direction="horizontal"
        rules="required"
    >
        <Radio
            variant="card"
            label="Oui"
            v-model="checked"
            :checkValue="1"
            cypressName="open_air_defecation"
        ></Radio>
        <Radio
            variant="card"
            label="Non"
            v-model="checked"
            :checkValue="0"
            cypressName="open_air_defecation"
        ></Radio>
        <Radio
            variant="card"
            label="Inconnu"
            v-model="checked"
            :checkValue="-1"
            cypressName="open_air_defecation"
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
