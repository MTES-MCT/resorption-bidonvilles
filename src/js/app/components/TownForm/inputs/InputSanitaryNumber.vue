<template>
    <SubQuestionWrapper label="Nombre de toilettes">
        <div class="mb-8">
            <InlineTextInput
                v-model="input"
                cypressName="sanitary_number"
                size="sm"
            />
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
