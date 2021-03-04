<template>
    <SubQuestionWrapper label="Nombre de toilettes" :space-between="false">
        <div class="flex items-center">
            <InlineTextInput
                v-model="input"
                cypressName="sanitary_number"
                size="sm"
                type="number"
                class="w-16"
            />
            <div
                class="ml-4"
                v-if="Number(input) > 0 && ratio && population.populationTotal"
            >
                Soit 1 toilette pour {{ ratio }} personnes
            </div>
        </div>
    </SubQuestionWrapper>
</template>

<script>
import SubQuestionWrapper from "#app/components/TownForm/ui/SubQuestionWrapper";
import InlineTextInput from "#app/components/ui/Form/input/InlineTextInput";
export default {
    components: { InlineTextInput, SubQuestionWrapper },
    props: {
        value: {
            type: [String, Number],
            required: false,
            default: ""
        },
        population: {
            type: Object
        }
    },

    data() {
        return {
            input: this.value
        };
    },

    computed: {
        ratio() {
            return Math.floor(
                Number(this.population.populationTotal) / Number(this.input)
            );
        }
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
