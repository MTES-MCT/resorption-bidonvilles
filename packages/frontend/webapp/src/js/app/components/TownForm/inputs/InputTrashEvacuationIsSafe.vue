<template>
    <SubQuestionWrapper
        label="Les dispositifs de ramassage des ordures ménagères (poubelles, bacs, bennes...) sont-ils en bon état et sécurisés (présence d’un couvercle ou équivalent fermant le dispositif après utilisation) ?"
    >
        <CheckableGroup
            id="trash_evacuation_is_safe"
            direction="row"
            withoutMargin
            validationName="Les dispositifs de ramassages des ordures sont-ils en bon état ?"
            rules="required"
        >
            <Radio
                label="Oui"
                v-model="checked"
                type="checkbox"
                :checkValue="1"
                cypressName="trash_evacuation_is_safe"
            ></Radio>
            <Radio
                label="Non"
                v-model="checked"
                type="checkbox"
                :checkValue="0"
                cypressName="trash_evacuation_is_safe"
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
