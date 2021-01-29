<template>
    <CheckableGroup
        label=" "
        id="census_status"
        rules="required"
        validationName="Statut du diagnostic social"
    >
        <Radio
            v-for="status in statuses"
            v-bind:key="status.value"
            variant="card"
            :label="status.label"
            v-model="checked"
            :checkValue="status.value"
            cypressName="census_status"
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
                { value: "none", label: "Non prévu" },
                { value: "scheduled", label: "Prévu" },
                { value: "done", label: "Réalisé" },
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
