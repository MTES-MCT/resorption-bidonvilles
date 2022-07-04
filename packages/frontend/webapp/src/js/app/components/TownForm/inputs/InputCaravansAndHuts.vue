<template>
    <div>
        <div class="flex">
            <TextInput
                id="caravans"
                label="Caravanes"
                class="w-32"
                v-model="input.caravans"
                rules="numeric|min_value:0"
                cypressName="caravans"
            ></TextInput>
            <TextInput
                id="huts"
                label="Cabanes"
                class="w-32 ml-5"
                v-model="input.huts"
                rules="numeric|min_value:0"
                cypressName="huts"
            ></TextInput>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: Object,
            required: false,
            default() {
                return {
                    caravans: undefined,
                    huts: undefined
                };
            }
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
