<template>
    <SubQuestionWrapper
        label="Existe-t-il des eaux stagnantes autour du point de distribution ?"
    >
        <CheckableGroup direction="row" withoutMargin>
            <Radio
                label="Oui"
                type="checkbox"
                v-model="checked"
                :checkValue="1"
                cypressName="water_stagnant_water"
            ></Radio>
            <Radio
                label="Non"
                type="checkbox"
                v-model="checked"
                :checkValue="0"
                cypressName="water_stagnant_water"
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
