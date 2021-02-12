<template>
    <div class="flex items-center text-sm">
        <div class="mr-4">Nombre de bacs</div>
        <InlineTextInput
            v-model="input"
            cypressName="water_hand_wash_access_number"
            size="sm"
        />
    </div>
</template>

<script>
import InlineTextInput from "#app/components/ui/Form/input/InlineTextInput";
export default {
    components: { InlineTextInput },
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
