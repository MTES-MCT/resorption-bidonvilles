<template>
    <CheckableGroup
        label=" "
        direction="horizontal"
        validationName="Les habitants ont-ils accès à l'eau ?"
        id="water_access_type"
        rules="required"
    >
        <Radio
            v-for="value in values"
            v-bind:key="value.id"
            variant="card"
            :label="value.label"
            v-model="checked"
            :checkValue="value.id"
            cypressName="water_access_type"
        ></Radio>
    </CheckableGroup>
</template>

<script>
export default {
    props: {
        value: {
            type: String,
            required: false,
            default: undefined
        }
    },

    data() {
        return {
            checked: this.value,
            values: [
                { id: "fontaine_publique", label: "Fontaine publique" },
                { id: "borne_incendie", label: "Borne incendie" },
                { id: "achat_bouteille", label: "Achat bouteille uniquement" },
                { id: "reservoir", label: "Réservoir / cuve / citerne" },
                {
                    id: "robinet_connecte_au_reseau",
                    label: "Robinet connecté au réseau d'eau"
                },
                { id: "autre", label: "Autre" },
                { id: "inconnu", label: "Inconnu" }
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
