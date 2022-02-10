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
import { get as getConfig } from "#helpers/api/config";

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
        const { topics } = getConfig();

        return {
            values: topics,
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
