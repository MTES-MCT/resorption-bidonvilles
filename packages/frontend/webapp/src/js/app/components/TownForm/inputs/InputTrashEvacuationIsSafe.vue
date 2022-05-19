<template>
    <CheckableGroup
        id="trash_evacuation_is_safe"
        label="Les dispositifs de ramassage des ordures ménagères (poubelles, bacs, bennes, …) sont-ils en bon état et sécurisés (présence d’un couvercle ou équivalent fermant le dispositif après utilisation) ?"
        direction="horizontal"
        validationName="Les dispositifs de ramassages des ordures sont-ils en bon état ?"
        rules="required"
    >
        <Radio
            variant="card"
            label="Oui"
            v-model="checked"
            :checkValue="1"
            cypressName="trash_evacuation_is_safe"
        ></Radio>
        <Radio
            variant="card"
            label="Non"
            v-model="checked"
            :checkValue="0"
            cypressName="trash_evacuation_is_safe"
        ></Radio>
        <Radio
            variant="card"
            label="Inconnu"
            v-model="checked"
            :checkValue="-1"
            cypressName="trash_evacuation_is_safe"
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
