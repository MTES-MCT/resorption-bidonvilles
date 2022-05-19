<template>
    <CheckableGroup
        label="Quels sont les types de toilettes installées ?"
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
            values: [
                {
                    id: "latrines",
                    label: "Latrines construites par les habitants"
                },
                { id: "toilettes_chimiques", label: "Toilettes chimiques" },
                {
                    id: "toilettes_seches",
                    label:
                        "Toilettes sèches installées par un prestataire/association"
                },
                { id: "toilettes_a_chasse", label: "Toilettes à chasse d'eau" }
            ]
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
