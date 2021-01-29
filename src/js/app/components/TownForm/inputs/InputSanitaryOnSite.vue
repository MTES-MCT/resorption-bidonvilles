<template>
    <SubQuestionWrapper label="Où se situe l'accès">
        <CheckableGroup direction="row">
            <Radio
                label="sur site"
                v-model="checked"
                :checkValue="1"
                cypressName="sanitary_insalubrious"
            ></Radio>
            <Radio
                label="aux abords"
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
