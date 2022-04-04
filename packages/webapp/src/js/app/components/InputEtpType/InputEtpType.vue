<template>
    <Select v-model="input" :withoutMargin="withoutMargin">
        <SelectOption value="">- Selectionner un choix -</SelectOption>
        <SelectOption
            v-for="item in etpTypes"
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
        },
        withoutMargin: {
            type: Boolean,
            required: false
        }
    },

    data() {
        return {
            input: this.value
        };
    },

    computed: {
        etpTypes() {
            return this.$store.state.config.configuration.etp_types;
        }
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
