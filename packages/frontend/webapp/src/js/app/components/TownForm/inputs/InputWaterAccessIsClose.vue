<template>
    <SubQuestionWrapper
        label="Quelle est la distance entre le point d'eau et l'habitation la plus éloignée ?"
    >
        <CheckableGroup
            id="water_access_is_close"
            validationName="Quelle est la distance entre le point d'eau et l'habitation la plus éloignée ?"
            direction="row"
            withoutMargin
            rules="required"
        >
            <Radio
                label="Moins de 200m"
                v-model="checked"
                type="checkbox"
                :checkValue="1"
                cypressName="water_access_is_close"
            ></Radio>
            <Radio
                label="Plus de 200m"
                v-model="checked"
                type="checkbox"
                :checkValue="0"
                cypressName="water_access_is_close"
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
