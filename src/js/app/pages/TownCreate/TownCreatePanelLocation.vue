<template>
    <div class="bg-gray-200 flex justify-between">
        <div class="p-5">
            <FormParagraph title="Adresse">
                test
            </FormParagraph>
            <FormParagraph title="Appellation du site">
                <InputName v-model="input.name"></InputName>
            </FormParagraph>
        </div>
        <div class="w-96 h-96">
            <MapV2></MapV2>
        </div>
    </div>
</template>

<script>
import InputName from "./inputs/InputName.vue";

export default {
    components: {
        InputName
    },

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
    },

    watch: {
        value() {
            this.input = this.value;
        },

        input() {
            this.$emit("input", this.input);
        }
    }
};
</script>
