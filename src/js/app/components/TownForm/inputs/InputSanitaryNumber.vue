<template>
    <SubQuestionWrapper label="Nombre de toilettes">
        <TextInput v-model="input" cypressName="sanitary_number" />
    </SubQuestionWrapper>
</template>

<script>
import SubQuestionWrapper from "#app/components/TownForm/ui/SubQuestionWrapper";
import TextInput from "#app/components/ui/Form/input/TextInput";
export default {
    components: { TextInput, SubQuestionWrapper },
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
