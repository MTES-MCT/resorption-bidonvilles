<template>
    <SubQuestionWrapper label="Les toilettes se situent-elles sur le site ?">
        <CheckableGroup direction="row" withoutMargin>
            <Radio
                type="checkbox"
                label="Oui"
                v-model="checked"
                :checkValue="1"
                cypressName="sanitary_on_site"
                disabled
            ></Radio>
            <Radio
                type="checkbox"
                label="Non"
                v-model="checked"
                :checkValue="0"
                cypressName="sanitary_on_site"
                disabled
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
