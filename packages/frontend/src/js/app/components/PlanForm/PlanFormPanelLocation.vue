<template>
    <FormGroup title="Lieu">
        Incoming...
    </FormGroup>
</template>

<script>
export default {
    props: {
        value: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            input: this.value
        };
    }
};
</script>
