<template>
    <CheckableGroup label=" ">
        <Checkbox
            variant="card"
            label="Français"
            v-model="checked"
            :checkValue="1"
        ></Checkbox>
        <Checkbox
            variant="card"
            label="Union européenne"
            v-model="checked"
            :checkValue="2"
        ></Checkbox>
        <Checkbox
            variant="card"
            label="Hors Union européenne"
            v-model="checked"
            :checkValue="3"
        ></Checkbox>
    </CheckableGroup>
</template>

<script>
module.exports = {
    props: {
        value: {
            type: Array,
            required: false,
            default: () => []
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
