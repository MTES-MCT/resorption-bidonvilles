<template>
    <CheckableGroup
        id="trash_evacuation_is_regular"
        label="La collecte des poubelles / bennes est-elle réalisée de manière régulière (passages à des jours fixes, 2 à 3 X par semaine, …) ? Indicateur : les poubelles ne débordent pas)"
        direction="horizontal"
        validationName="La collecte des poubelles est-elle réalisée de manière régulière ?"
        rules="required"
    >
        <Radio
            variant="card"
            label="Oui"
            v-model="checked"
            :checkValue="1"
            cypressName="trash_evacuation_is_regular"
        ></Radio>
        <Radio
            variant="card"
            label="Non"
            v-model="checked"
            :checkValue="0"
            cypressName="trash_evacuation_is_regular"
        ></Radio>
        <Radio
            variant="card"
            label="Inconnu"
            v-model="checked"
            :checkValue="-1"
            cypressName="trash_evacuation_is_regular"
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
