<template>
    <SubQuestionWrapper
        label="Existe-t-il des eaux stagnantes autour du point de distribution ?"
    >
        <CheckableGroup
            id="water_access_has_stagnant_water"
            validationName="Existe-t-il des eaux stagnantes autour du point de distribution ?"
            direction="row"
            withoutMargin
            rules="required"
        >
            <Radio
                label="Oui"
                v-model="checked"
                type="checkbox"
                :checkValue="1"
                cypressName="water_access_has_stagnant_water"
            ></Radio>
            <Radio
                label="Non"
                v-model="checked"
                type="checkbox"
                :checkValue="0"
                cypressName="water_access_has_stagnant_water"
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
