<template>
    <SubQuestionWrapper
        label="Constate-t-on une accumulation de déchets type encombrants (hors ferraille) ou gravats sur le site ou aux abords ?"
    >
        <CheckableGroup
            id="trash_bulky_is_piling"
            direction="row"
            withoutMargin
            validationName="Constate-t-on une accumulation de déchets type encombrants ?"
            rules="required"
        >
            <Radio
                label="Oui"
                v-model="checked"
                type="checkbox"
                :checkValue="1"
                cypressName="trash_bulky_is_piling"
            ></Radio>
            <Radio
                label="Non"
                v-model="checked"
                type="checkbox"
                :checkValue="0"
                cypressName="trash_bulky_is_piling"
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
