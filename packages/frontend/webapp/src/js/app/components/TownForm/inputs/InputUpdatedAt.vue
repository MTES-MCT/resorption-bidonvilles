<template>
    <DatepickerV2
        id="updated_at"
        label="Date de mise à jour"
        v-model="updatedAt"
        rules="required"
        :disabled-dates="{ to: this.disableBefore, from: disableAfter }"
        cypressName="updated_at"
    ></DatepickerV2>
</template>

<script>
export default {
    props: {
        value: {
            type: Date,
            required: false,
            default() {
                return new Date();
            }
        },

        disableBefore: {
            type: Date,
            required: false
        },
        disableAfter: {
            type: Date,
            required: false,
            default: new Date()
        }
    },

    data() {
        return {
            updatedAt: this.value
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
