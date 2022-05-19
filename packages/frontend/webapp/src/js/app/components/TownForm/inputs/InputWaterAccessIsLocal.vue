<template>
    <CheckableGroup
        id="water_access_is_local"
        label="Où se situe l’accès ?"
        direction="horizontal"
        rules="required"
    >
        <Radio
            variant="card"
            label="Sur site"
            v-model="checked"
            :checkValue="1"
            cypressName="water_access_is_local"
        ></Radio>
        <Radio
            variant="card"
            label="À l'extérieur du site"
            v-model="checked"
            :checkValue="0"
            cypressName="water_access_is_local"
        ></Radio>
        <Radio
            variant="card"
            label="Inconnu"
            v-model="checked"
            :checkValue="-1"
            cypressName="water_access_is_local"
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
