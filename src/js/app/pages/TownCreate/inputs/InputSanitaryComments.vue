<template>
    <TextArea
        label="Modalités d'accès"
        info="Exemples : 3 toilettes sèches, toilettes raccordées au réseau, un bloc sanitaire fourni par la ville..."
        v-model="input"
    ></TextArea>
</template>

<script>
module.exports = {
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
