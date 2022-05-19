<template>
    <CheckableGroup
        id="water_access_is_continuous"
        label="L'accès est-il continu ? C'est-à-dire qu'il ne varie pas en qualité et en quantité dans la journée et les saisons, sans limite dans le temps."
        direction="horizontal"
        validationName="L'accès est-il continu ?"
        rules="required"
    >
        <Radio
            variant="card"
            label="Oui"
            v-model="checked"
            :checkValue="1"
            cypressName="water_access_is_continuous"
        ></Radio>
        <Radio
            variant="card"
            label="Non"
            v-model="checked"
            :checkValue="0"
            cypressName="water_access_is_continuous"
        ></Radio>
        <Radio
            variant="card"
            label="Inconnu"
            v-model="checked"
            :checkValue="-1"
            cypressName="water_access_is_continuous"
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
