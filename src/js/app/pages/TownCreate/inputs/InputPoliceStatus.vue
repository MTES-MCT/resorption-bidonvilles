<template>
    <CheckableGroup label="Statut du concours de la force publique">
        <Radio
            variant="card"
            label="Non demandé"
            v-model="checked"
            :checkValue="1"
        ></Radio>
        <Radio
            variant="card"
            label="Demandé"
            v-model="checked"
            :checkValue="2"
        ></Radio>
        <Radio
            variant="card"
            label="Obtenu"
            v-model="checked"
            :checkValue="3"
        ></Radio>
        <Radio
            variant="card"
            label="Inconnu"
            v-model="checked"
            :checkValue="3"
        ></Radio>
    </CheckableGroup>
</template>

<script>
module.exports = {
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
