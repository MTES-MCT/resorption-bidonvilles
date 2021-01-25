<template>
    <FormGroup title="Caractéristiques du site">
        <FormParagraph
            title="Quelles sont les dates clés du site ?"
            class="w-128"
        >
            <div class="w-64">
                <InputCreatedAt v-model="input.created_at"></InputCreatedAt>
                <InputDeclaredAt v-model="input.declared_at"></InputDeclaredAt>
            </div>

            <InputFieldType v-model="input.field_type"></InputFieldType>
            <InputAddressDetails
                v-model="input.address_details"
            ></InputAddressDetails>
        </FormParagraph>

        <FormParagraph title="Quel est le propriétaire ?" class="w-128">
            <InputOwnerType v-model="input.owner_type"></InputOwnerType>
            <InputOwner v-model="input.owner"></InputOwner>
        </FormParagraph>
    </FormGroup>
</template>

<script>
import InputCreatedAt from "./inputs/InputCreatedAt.vue";
import InputDeclaredAt from "./inputs/InputDeclaredAt.vue";
import InputFieldType from "./inputs/InputFieldType.vue";
import InputAddressDetails from "./inputs/InputAddressDetails.vue";
import InputOwnerType from "./inputs/InputOwnerType.vue";
import InputOwner from "./inputs/InputOwner.vue";

export default {
    components: {
        InputCreatedAt,
        InputDeclaredAt,
        InputFieldType,
        InputAddressDetails,
        InputOwnerType,
        InputOwner
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
