<template>
    <FormGroup title="Financements">
        <FormParagraph title="Comment est financé le dispositif ?">
            <InputFinances
                v-model="input.finances"
                :realAmount="realAmount"
            ></InputFinances>
        </FormParagraph>
    </FormGroup>
</template>

<script>
import InputFinances from "#app/components/InputFinances/InputFinances.vue";

export default {
    props: {
        value: {
            type: Object,
            required: true
        },
        realAmount: {
            type: String, // either "none", "all", or "past"
            required: false,
            default: "none"
        }
    },

    components: {
        InputFinances
    },

    data() {
        return {
            input: this.value
        };
    }
};
</script>
