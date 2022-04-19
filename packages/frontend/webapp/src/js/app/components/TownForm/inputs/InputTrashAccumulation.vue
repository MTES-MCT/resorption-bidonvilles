<template>
    <SubQuestionWrapper
        label="Constate-t-on une accumulation de déchets sur le site ou aux abords ?"
    >
        <CheckableGroup direction="row" withoutMargin>
            <Radio
                label="Oui"
                type="checkbox"
                v-model="checked"
                :checkValue="1"
                cypressName="trash_accumulation"
            ></Radio>
            <Radio
                label="Non"
                type="checkbox"
                v-model="checked"
                :checkValue="0"
                cypressName="trash_accumulation"
            ></Radio>
        </CheckableGroup>
    </SubQuestionWrapper>
</template>

<script>
import SubQuestionWrapper from "../ui/SubQuestionWrapper";
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
