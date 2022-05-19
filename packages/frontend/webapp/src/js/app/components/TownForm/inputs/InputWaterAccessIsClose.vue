<template>
    <CheckableGroup
        id="water_access_is_close"
        label="Distance point d’eau / habitation la plus éloignée ?"
        direction="horizontal"
        rules="required"
    >
        <Radio
            variant="card"
            label="Moins de 200m"
            v-model="checked"
            :checkValue="1"
            cypressName="water_access_is_close"
        ></Radio>
        <Radio
            variant="card"
            label="Plus de 200m"
            v-model="checked"
            :checkValue="0"
            cypressName="water_access_is_close"
        ></Radio>
        <Radio
            variant="card"
            label="Inconnu"
            v-model="checked"
            :checkValue="-1"
            cypressName="water_access_is_close"
        ></Radio>
    </CheckableGroup>
</template>

<script>
export default {
    props: {
        value: {
            type: Number,
            required: false,
            default: undefined
        }
    },

    data() {
        return {
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
