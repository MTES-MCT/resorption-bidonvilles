<template>
    <div class="bg-gray-200 flex">
        <div class="p-5 flex-grow">
            <FormParagraph title="Adresse">
                <InputAddress
                    v-model="input.address"
                    @change="onAddressChange"
                ></InputAddress>
            </FormParagraph>
            <FormParagraph title="Appellation du site">
                <InputName v-model="input.name"></InputName>
            </FormParagraph>
        </div>

        <div class="w-96 h-96" v-if="input.address.label">
            <InputCoordinates v-model="input.coordinates"></InputCoordinates>
        </div>
    </div>
</template>

<script>
import InputAddress from "./inputs/InputAddress.vue";
import InputName from "./inputs/InputName.vue";
import InputCoordinates from "./inputs/InputCoordinates.vue";

export default {
    components: {
        InputAddress,
        InputName,
        InputCoordinates
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

    methods: {
        onAddressChange(coordinates) {
            this.input.coordinates = coordinates;
        }
    }
};
</script>
