<template>
    <SubQuestionWrapper
        label="Constate-t-on des marques de défécation à l'air libre ?"
    >
        <CheckableGroup direction="row">
            <Radio
                label="Oui"
                v-model="checked"
                :checkValue="1"
                cypressName="sanitary_insalubrious"
            ></Radio>
            <Radio
                label="Non"
                v-model="checked"
                :checkValue="0"
                cypressName="sanitary_insalubrious"
            ></Radio>
        </CheckableGroup>
    </SubQuestionWrapper>
</template>

<script>
import SubQuestionWrapper from "../ui/SubQuestionWrapper";
export default {
    components: { SubQuestionWrapper },
    props: {
        value: {
            type: Number,
            required: false,
            default: undefined
        }
    },

    data() {
        return {
            checked: this.value
        };
    },

    watch: {
        value() {
            this.checked = this.value;
        },

        checked() {
            this.$emit("input", this.checked);
        }
    }
};
</script>
