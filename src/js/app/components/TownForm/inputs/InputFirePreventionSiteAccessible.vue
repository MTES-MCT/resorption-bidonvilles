<template>
    <SubQuestionWrapper
        label="Est-ce que le site est accessible aux pompiers ?"
    >
        <CheckableGroup direction="row">
            <Radio
                label="Oui"
                v-model="checked"
                :checkValue="1"
                cypressName="fire_prevention_site_accessible"
            ></Radio>
            <Radio
                label="Non"
                v-model="checked"
                :checkValue="0"
                cypressName="fire_prevention_site_accessible"
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
