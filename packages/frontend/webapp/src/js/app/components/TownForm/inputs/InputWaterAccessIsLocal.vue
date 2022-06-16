<template>
    <SubQuestionWrapper label="Où se situe l'accès ?">
        <CheckableGroup
            id="water_access_is_local"
            validationName="Où se situe l’accès ?"
            direction="row"
            withoutMargin
            rules="required"
        >
            <Radio
                label="Sur site"
                v-model="checked"
                type="checkbox"
                :checkValue="1"
                cypressName="water_access_is_local"
            ></Radio>
            <Radio
                label="À l'extérieur du site"
                v-model="checked"
                type="checkbox"
                :checkValue="0"
                cypressName="water_access_is_local"
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
