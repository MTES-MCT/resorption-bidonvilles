<template>
    <div class="flex items-center">
        <div class="mr-4">Nombre de bacs</div>
        <InlineTextInput
            v-model="input"
            cypressName="water_hand_wash_access_number"
            size="sm"
            class="w-16"
        />
        <div
            class="ml-4"
            v-if="Number(input) > 0 && ratio && population.populationTotal"
        >
            Soit 1 bac pour {{ ratio }} personnes
        </div>
    </div>
</template>

<script>
import InlineTextInput from "#app/components/ui/Form/input/InlineTextInput";
export default {
    components: { InlineTextInput },
    props: {
        value: {
            type: Number,
            required: false,
            default: undefined
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
