<template>
    <SubQuestionWrapper
        label="Des inégalités d'accès ont-elles été constatées ?"
        info="Il est recommandé 1 robinet pour 50 personnes. Cette recommandation doit être adaptée aux spécificités du site."
    >
        <CheckableGroup
            id="water_access_is_unequal"
            validationName="Des inégalités d'accès ont-elles été constatées ?"
            direction="row"
            withoutMargin
        >
            <Radio
                label="Oui"
                v-model="checked"
                type="checkbox"
                :checkValue="1"
                cypressName="water_access_is_unequal"
            ></Radio>
            <Radio
                label="Non"
                v-model="checked"
                type="checkbox"
                :checkValue="0"
                cypressName="water_access_is_unequal"
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
