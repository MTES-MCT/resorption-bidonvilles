<template>
    <DatepickerV2
        id="updated_at"
        label="Date de mise à jour"
        v-model="updatedAt"
        rules="required"
        :disabled-dates="{ to: this.disableBefore, from: new Date() }"
        cypressName="updated_at"
    ></DatepickerV2>
</template>

<script>
export default {
    props: {
        value: {
            type: Date,
            required: false
        },

        disableBefore: {
            type: Date,
            required: false
        }
    },

    data() {
        return {
            updatedAt: new Date()
        };
    },

    watch: {
        value() {
            this.input = this.value;
        },

        updatedAt() {
            this.$emit("input", this.updatedAt);
        }
    }
};
</script>
