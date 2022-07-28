<template>
    <SubQuestionWrapper
        label="Combien de poubelles / bennes sont à proximité immédiate du site (moins de 100 mètres) ?"
        withoutMargin
    >
        <InlineTextInput
            size="sm"
            v-model="input"
            class="w-16"
            cypressName="trash_cans_on_site"
            disabled
        />
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
