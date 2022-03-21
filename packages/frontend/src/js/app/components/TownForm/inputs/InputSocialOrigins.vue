<template>
    <CheckableGroup label=" ">
        <Checkbox
            v-for="value in values"
            v-bind:key="value.id"
            variant="card"
            :label="value.label"
            v-model="checked"
            :checkValue="value.id"
            cypressName="social_origins"
        ></Checkbox>
    </CheckableGroup>
</template>

<script>
export default {
    props: {
        value: {
            type: Array,
            required: false,
            default: () => []
        }
    },

    data() {
        return {
            checked: this.value
        };
    },

    computed: {
        values() {
            return this.$store.state.config.configuration.social_origins;
        }
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
