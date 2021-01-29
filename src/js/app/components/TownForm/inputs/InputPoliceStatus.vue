<template>
    <CheckableGroup
        label="Statut du concours de la force publique"
        id="police_status"
        rules="required"
    >
        <Radio
            v-for="status in statuses"
            v-bind:key="status.value"
            variant="card"
            :label="status.label"
            v-model="checked"
            :checkValue="status.value"
            cypressName="police_status"
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
            statuses: [
                { value: "none", label: "Non demandé" },
                { value: "requested", label: "Demandé" },
                { value: "granted", label: "Obtenu" },
                { value: "null", label: "Inconnu" }
            ],
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
