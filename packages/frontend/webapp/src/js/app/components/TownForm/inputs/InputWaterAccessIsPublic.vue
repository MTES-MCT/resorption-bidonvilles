<template>
    <CheckableGroup
        id="water_access_is_public"
        label="Est-ce un point d'eau sur la voie publique ?"
        direction="horizontal"
        rules="required"
    >
        <Radio
            variant="card"
            label="Oui"
            v-model="checked"
            :checkValue="1"
            cypressName="water_access_is_public"
        ></Radio>
        <Radio
            variant="card"
            label="Non"
            v-model="checked"
            :checkValue="0"
            cypressName="water_access_is_public"
        ></Radio>
        <Radio
            variant="card"
            label="Inconnu"
            v-model="checked"
            :checkValue="-1"
            cypressName="water_access_is_public"
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
