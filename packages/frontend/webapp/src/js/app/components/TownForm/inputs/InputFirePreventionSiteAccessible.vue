<template>
    <SubQuestionWrapper
        label="Est-ce que le site est accessible aux pompiers ?"
    >
        <CheckableGroup direction="row" withoutMargin>
            <Radio
                label="Oui"
                type="checkbox"
                v-model="checked"
                :checkValue="1"
                cypressName="fire_prevention_site_accessible"
                disabled
            ></Radio>
            <Radio
                label="Non"
                type="checkbox"
                v-model="checked"
                :checkValue="0"
                cypressName="fire_prevention_site_accessible"
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
