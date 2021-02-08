<template>
    <SubQuestionWrapper label="L'eau est-elle potable ?">
        <CheckableGroup direction="row">
            <Radio
                type="checkbox"
                label="Oui"
                v-model="checked"
                :checkValue="1"
                cypressName="water_potable"
            ></Radio>
            <Radio
                type="checkbox"
                label="Non"
                v-model="checked"
                :checkValue="0"
                cypressName="water_potable"
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
