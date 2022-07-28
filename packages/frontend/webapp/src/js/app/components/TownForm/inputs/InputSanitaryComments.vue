<template>
    <TextArea
        id="sanitary_comments"
        label="Modalités d'accès"
        info="Exemples : toilettes sèches avec fosse / sèches sans fosse, chimiques, raccordées au réseau des eaux usées "
        v-model="input"
        cypressName="sanitary_comments"
        placeholder="Votre message"
        disabled
    ></TextArea>
</template>

<script>
export default {
    props: {
        value: {
            type: String,
            required: false,
            default: ""
        }
    },

    data() {
        return {
            input: this.value
        };
    },

    watch: {
        value() {
            this.input = this.value;
        },

        input() {
            this.$emit("input", this.input);
        }
    }
};
</script>
