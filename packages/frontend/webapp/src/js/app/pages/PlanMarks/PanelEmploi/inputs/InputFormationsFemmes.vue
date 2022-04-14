<template>
    <TextInput
        id="formations_femmes"
        label=""
        width="w-32"
        v-model="input"
        rules="numeric|min_value:0"
        :withoutMargin="true"
    ></TextInput>
</template>

<script>
export default {
    props: {
        value: {
            type: [String, Number],
            required: false
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
