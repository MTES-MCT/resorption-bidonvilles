<template>
    <SubQuestionWrapper
        label="Constate-t-on des marques de défécation à l’air libre ?"
    >
        <CheckableGroup
            id="sanitary_open_air_defecation"
            validationName="Constate-t-on des marques de défécation à l’air libre ?"
            direction="row"
            withoutMargin
            rules="required"
        >
            <Radio
                label="Oui"
                v-model="checked"
                type="checkbox"
                :checkValue="1"
                cypressName="open_air_defecation"
            ></Radio>
            <Radio
                label="Non"
                v-model="checked"
                type="checkbox"
                :checkValue="0"
                cypressName="open_air_defecation"
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
