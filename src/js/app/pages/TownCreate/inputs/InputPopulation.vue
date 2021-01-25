<template>
    <div class="flex">
        <TextInput
            label="Ménages"
            class="w-32"
            v-model="input.populationFamilies"
        ></TextInput>
        <TextInput
            label="Personnes"
            class="w-32 ml-5"
            v-model="input.populationTotal"
        ></TextInput>
        <TextInput
            label="Mineurs"
            class="w-32 ml-5"
            v-model="input.populationMinors"
        ></TextInput>
    </div>
</template>

<script>
module.exports = {
    props: {
        value: {
            type: Object,
            required: false,
            default() {
                return {
                    populationTotal: undefined,
                    populationFamilies: undefined,
                    populationMinors: undefined
                };
            }
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
