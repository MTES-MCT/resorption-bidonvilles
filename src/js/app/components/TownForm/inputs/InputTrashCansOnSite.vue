<template>
    <SubQuestionWrapper
        label="Combien de poubelles / benes sont à proximité immédiate du site (moins de 100 mètres)"
    >
        <InlineTextInput
            size="sm"
            class="mb-6"
            v-model="input"
            cypressName="trash_cans_on_site"
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

        checked() {
            this.$emit("input", this.value);
        }
    }
};
</script>
