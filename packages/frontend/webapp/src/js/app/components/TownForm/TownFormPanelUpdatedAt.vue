<template>
    <FormGroup title="Date de mise à jour">
        <FormParagraph
            title="Les données correspondent-elles à une date antérieure à aujourd'hui ?"
        >
            <div>
                <p class="mb-4">
                    Il est impossible de spécifier une date antérieure à la
                    dernière modification
                </p>
                <InputUpdatedAt
                    v-model="updatedAt"
                    :disableBefore="disableBefore"
                ></InputUpdatedAt>
            </div>
        </FormParagraph>
    </FormGroup>
</template>

<script>
import InputUpdatedAt from "./inputs/InputUpdatedAt.vue";

export default {
    components: {
        InputUpdatedAt
    },

    props: {
        value: {
            type: Date,
            required: true
        },

        disableBefore: {
            type: Date,
            required: false
        }
    },

    data() {
        return {
            updatedAt: this.value
        };
    },
    watch: {
        updatedAt() {
            this.$emit("input", this.updatedAt);
        }
    }
};
</script>
