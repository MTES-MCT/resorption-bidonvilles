<template>
    <SubQuestionWrapper
        label="Y a-t-il un point de lavage des mains à proximité des toilettes ?"
    >
        <CheckableGroup
            id="sanitary_hand_washing"
            validationName="Y a-t-il un point de lavage des mains à proximité des toilettes ?"
            direction="row"
            withoutMargin
            rules="required"
        >
            <Radio
                label="Oui"
                v-model="checked"
                type="checkbox"
                :checkValue="1"
                cypressName="hand_washing"
            ></Radio>
            <Radio
                label="Non"
                v-model="checked"
                type="checkbox"
                :checkValue="0"
                cypressName="hand_washing"
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
