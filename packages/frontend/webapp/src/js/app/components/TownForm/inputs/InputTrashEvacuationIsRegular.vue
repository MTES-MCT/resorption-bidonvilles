<template>
    <SubQuestionWrapper
        label="La collecte des poubelles / bennes est-elle réalisée de manière régulière (passages à des jours fixes, 2 à 3 X par semaine, …) ? Indicateur : les poubelles ne débordent pas)"
    >
        <CheckableGroup
            id="trash_evacuation_is_regular"
            direction="row"
            withoutMargin
            validationName="La collecte des poubelles est-elle réalisée de manière régulière ?"
            rules="required"
        >
            <Radio
                label="Oui"
                v-model="checked"
                type="checkbox"
                :checkValue="1"
                cypressName="trash_evacuation_is_regular"
            ></Radio>
            <Radio
                label="Non"
                v-model="checked"
                type="checkbox"
                :checkValue="0"
                cypressName="trash_evacuation_is_regular"
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
