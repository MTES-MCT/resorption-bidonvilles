<template>
    <CheckableGroup
        id="trash_bulky_is_piling"
        label="Constate-t-on une accumulation de déchets type encombrants (hors ferraille) ou gravats sur le site ou aux abords ?"
        direction="horizontal"
        validationName="Constate-t-on une accumulation de déchets type encombrants ?"
        rules="required"
    >
        <Radio
            variant="card"
            label="Oui"
            v-model="checked"
            :checkValue="1"
            cypressName="trash_bulky_is_piling"
        ></Radio>
        <Radio
            variant="card"
            label="Non"
            v-model="checked"
            :checkValue="0"
            cypressName="trash_bulky_is_piling"
        ></Radio>
        <Radio
            variant="card"
            label="Inconnu"
            v-model="checked"
            :checkValue="-1"
            cypressName="trash_bulky_is_piling"
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
