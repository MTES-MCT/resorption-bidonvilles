<template>
    <CheckableGroup
        id="trash_evacuation_is_close"
        label="Y a-t-il des dispositifs de ramassage des ordures ménagères (poubelles, bacs, bennes...) à proximité immédiate du site (moins de 100m) ?"
        direction="horizontal"
        validationName="Y a-t-il des dispositifs de ramassage des ordures ménagères à proximité immédiate ?"
        rules="required"
    >
        <Radio
            variant="card"
            label="Oui"
            v-model="checked"
            :checkValue="1"
            cypressName="trash_evacuation_is_close"
        ></Radio>
        <Radio
            variant="card"
            label="Non"
            v-model="checked"
            :checkValue="0"
            cypressName="trash_evacuation_is_close"
        ></Radio>
        <Radio
            variant="card"
            label="Inconnu"
            v-model="checked"
            :checkValue="-1"
            cypressName="trash_evacuation_is_close"
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
