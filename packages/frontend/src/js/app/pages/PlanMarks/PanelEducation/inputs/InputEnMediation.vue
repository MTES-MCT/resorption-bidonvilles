<template>
    <TextInput
        id="en_mediation"
        label="Combien bénéficient d’une action de médiation (3 – 18 ans) ?"
        width="w-32"
        v-model="input"
        rules="numeric|min_value:0"
    ></TextInput>
</template>

<script>
export default {
    props: {
        value: {
            type: [String, Number],
            required: false
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
