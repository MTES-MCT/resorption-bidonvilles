<template>
    <SubQuestionWrapper
        label="L'accès est-il continu ? c'est-à-dire qu'il ne varie pas en qualité et en quantité dans la journée et les saisons, sans limite dans le temps."
    >
        <CheckableGroup direction="row" withoutMargin>
            <Radio
                label="Oui"
                v-model="checked"
                :checkValue="1"
                type="checkbox"
                cypressName="water_continuous_access"
            ></Radio>
            <Radio
                label="Non"
                v-model="checked"
                :checkValue="0"
                type="checkbox"
                cypressName="water_continuous_access"
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
