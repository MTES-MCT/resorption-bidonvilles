<template>
    <CheckableGroup
        label="Champs d'intervention"
        info="Les thématiques sélectionnées définissent l'action que vous menez et les indicateurs de suivi associés."
        id="topics"
        :showMandatoryStar="true"
        rules="required"
    >
        <Checkbox
            v-for="value in values"
            v-bind:key="value.uid"
            variant="card"
            :label="value.name"
            v-model="checked"
            :checkValue="value.uid"
            :disabled="disabled"
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
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    data() {
        return {
            checked: this.value
        };
    },

    computed: {
        values() {
            return this.$store.state.config.configuration.topics;
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
