<template>
    <TextInput
        id="name"
        label=""
        info="Exemples : Entrepôt de la Poste, Rond-point du centre..."
        v-model="input"
        cypressName="name"
    ></TextInput>
</template>

<script>
export default {
    props: {
        value: {
            type: String,
            required: false,
            default: ""
        }
    },

    data() {
        return {
            input: this.value
        };
    },

    watch: {
        value() {
            this.input = this.value;
        },

        input() {
            this.$emit("input", this.input);
        }
    }
};
</script>
