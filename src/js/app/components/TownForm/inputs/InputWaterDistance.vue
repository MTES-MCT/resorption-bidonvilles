<template>
    <SubQuestionWrapper label="Où se situe l'accès ?">
        <CheckableGroup direction="vertical" withoutMargin>
            <Radio
                label="sur site ou à moins de 20 mètres"
                v-model="checked"
                :checkValue="0"
                type="checkbox"
                cypressName="water_distance"
            ></Radio>
            <Radio
                label="entre 20 et 50 mètres du site"
                v-model="checked"
                :checkValue="20"
                type="checkbox"
                cypressName="water_distance"
            ></Radio>
            <Radio
                label="entre 50 et 100 mètres du site"
                v-model="checked"
                :checkValue="50"
                type="checkbox"
                cypressName="water_distance"
            ></Radio>
            <Radio
                label="à plus de 100 mètres du site"
                v-model="checked"
                :checkValue="100"
                type="checkbox"
                cypressName="water_distance"
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
