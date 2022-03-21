<template>
    <Select v-model="input" rules="required" :withoutMargin="true">
        <SelectOption value="none">- Selectionner un choix -</SelectOption>
        <SelectOption
            v-for="item in options"
            :key="item.uid"
            :value="item.uid"
            >{{ item.name }}</SelectOption
        >
    </Select>
</template>

<script>
export default {
    props: {
        value: {
            type: String,
            required: false
        }
    },

    data() {
        return {
            input: this.value
        };
    },

    computed: {
        options() {
            return this.$store.state.config.configuration.finance_types;
        }
    },

    watch: {
        // two-way binding
        value() {
            this.input = this.value;
        },

        input() {
            this.$emit("input", this.input);
        }
    }
};
</script>
