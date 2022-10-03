<template>
    <CheckableGroup
        info="Quels sont les types de toilettes installées ?"
        validationName="Quels sont les types de toilettes installées ?"
        id="sanitary_toilet_types"
    >
        <Checkbox
            v-for="value in values"
            v-bind:key="value.id"
            variant="card"
            :label="value.label"
            v-model="checked"
            :checkValue="value.id"
            cypressName="toilet_types"
        ></Checkbox>
    </CheckableGroup>
</template>

<script>
import toiletTypes from "#frontend/common/helpers/town/living_conditions/toilet_types";

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
            checked: this.value,
            values: Object.keys(toiletTypes).map(id => ({
                id,
                label: toiletTypes[id]
            }))
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
