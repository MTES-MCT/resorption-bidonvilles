<template>
    <p>
        <InputLabel label="Difficultés éventuelles rencontrées" />
        <Checkbox
            v-for="option in options"
            :key="option.value"
            :checkValue="option.value"
            v-model="input"
            :label="option.label"
        />
    </p>
</template>

<script>
import InputLabel from "#app/components/ui/Form/utils/InputLabel.vue";

export default {
    props: {
        value: {
            type: Array,
            required: false,
            default() {
                return [];
            }
        }
    },

    components: {
        InputLabel
    },

    data() {
        return {
            input: this.value,
            options: [
                { value: "cantine", label: "Cantine" },
                {
                    value: "place_up2a",
                    label: "Manque de place en UP2A"
                },
                { value: "transport", label: "Transport" }
            ]
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
