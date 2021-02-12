<template>
    <SubQuestionWrapper
        label="Est-ce qu'il y a des bacs de lavage des mains ?"
        :withoutBorder="withoutBorder"
    >
        <CheckableGroup direction="row" withoutMargin>
            <Radio
                label="Oui"
                v-model="checked"
                type="checkbox"
                :checkValue="1"
                cypressName="water_hand_wash_access"
            ></Radio>
            <Radio
                label="Non"
                v-model="checked"
                type="checkbox"
                :checkValue="0"
                cypressName="water_hand_wash_access"
            ></Radio>
        </CheckableGroup>
    </SubQuestionWrapper>
</template>

<script>
import SubQuestionWrapper from "#app/components/TownForm/ui/SubQuestionWrapper";
export default {
    components: { SubQuestionWrapper },
    props: {
        value: {
            type: Number,
            required: false,
            default: undefined
        },
        withoutBorder: {
            type: Boolean
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
