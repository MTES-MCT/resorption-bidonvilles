<template>
    <div class="bg-gray-200">
        <div class="pt-5 pl-5 pr-5 pb-2">
            <FormParagraph title="Adresse" :showMandatoryStar="true">
                <InputAddress
                    v-model="input.address"
                    @change="onAddressChange"
                ></InputAddress>
            </FormParagraph>
        </div>

        <div class="w-full h-96" v-if="input.address.label">
            <InputCoordinates v-model="input.coordinates"></InputCoordinates>
        </div>
    </div>
</template>

<script>
import InputAddress from "#app/components/TownForm/inputs/InputAddress.vue";
import InputCoordinates from "#app/components/TownForm/inputs/InputCoordinates.vue";

export default {
    props: {
        value: {
            type: Object,
            required: false,
            default() {
                return {};
            }
        }
    },

    components: {
        InputAddress,
        InputCoordinates
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
    },

    methods: {
        onAddressChange(coordinates) {
            this.input.coordinates = coordinates;
        }
    }
};
</script>
