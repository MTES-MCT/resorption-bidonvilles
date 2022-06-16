<template>
    <CheckableGroup
        info="Quelle est la source de l’accès ?"
        validationName="Quelle est la source de l'accès à l'électricité ?"
        id="electricity_access_types"
        rules="required"
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
                    id: "electrogene",
                    label: "Groupe électrogène"
                },
                { id: "reseau_urbain", label: "Raccordement au réseau urbain" },
                {
                    id: "installation_du_bati",
                    label: "Utilisation de l’installation du bâtit si squat"
                }
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
