<template>
    <div class="flex">
        <TextInput
            id="population_minors_0_3"
            label="0 - 3 ans"
            class="w-32"
            v-model="input.populationMinors0To3"
            rules="numeric|min_value:0"
            cypressName="population_minors_0_3"
        ></TextInput>
        <TextInput
            id="population_minors_3_6"
            label="3 - 6 ans"
            class="w-32 ml-5"
            v-model="input.populationMinors3To6"
            rules="numeric|min_value:0"
            cypressName="population_minors_3_6"
        ></TextInput>
        <TextInput
            id="population_minors_6_12"
            label="6 - 12 ans"
            class="w-32 ml-5"
            v-model="input.populationMinors6To12"
            rules="numeric|min_value:0"
            cypressName="population_minors_6_12"
        ></TextInput>
        <TextInput
            id="population_minors_12_16"
            label="12 - 16 ans"
            class="w-32 ml-5"
            v-model="input.populationMinors12To16"
            rules="numeric|min_value:0"
            cypressName="population_minors_12_16"
        ></TextInput>
        <TextInput
            id="population_minors_16_18"
            label="16 - 18 ans"
            class="w-32 ml-5"
            v-model="input.populationMinors16To18"
            rules="numeric|min_value:0"
            cypressName="population_minors_16_18"
        ></TextInput>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: Object,
            required: false,
            default() {
                return {
                    populationMinors0To3: undefined,
                    populationMinors3To6: undefined,
                    populationMinors6To12: undefined,
                    populationMinors12To16: undefined,
                    populationMinors16To18: undefined
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
