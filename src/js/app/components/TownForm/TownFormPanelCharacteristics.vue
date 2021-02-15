<template>
    <FormGroup title="Caractéristiques du site">
        <FormParagraph
            title="Quelles sont les dates clés du site ?"
            class="w-128"
        >
            <div class="w-64">
                <InputBuiltAt v-model="input.built_at"></InputBuiltAt>
                <InputDeclaredAt
                    v-model="input.declared_at"
                    :disableBefore="input.built_at"
                ></InputDeclaredAt>
            </div>

            <InputFieldType v-model="input.field_type"></InputFieldType>
            <InputDetailedAddress
                v-model="input.detailed_address"
            ></InputDetailedAddress>
        </FormParagraph>

        <FormParagraph
            title="Quel est le propriétaire ?"
            :showMandatoryStar="true"
            class="w-128"
        >
            <InputOwnerType
                v-model="input.owner_type"
                ref="ownerType"
            ></InputOwnerType>
            <InputOwner
                v-if="!ownerTypeIsUnknown"
                v-model="input.owner"
            ></InputOwner>
        </FormParagraph>
    </FormGroup>
</template>

<script>
import InputBuiltAt from "./inputs/InputBuiltAt.vue";
import InputDeclaredAt from "./inputs/InputDeclaredAt.vue";
import InputFieldType from "./inputs/InputFieldType.vue";
import InputDetailedAddress from "./inputs/InputDetailedAddress.vue";
import InputOwnerType from "./inputs/InputOwnerType.vue";
import InputOwner from "./inputs/InputOwner.vue";

export default {
    components: {
        InputBuiltAt,
        InputDeclaredAt,
        InputFieldType,
        InputDetailedAddress,
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

    computed: {
        ownerTypeIsUnknown() {
            const value = this.input.owner_type;
            if (this.$refs.ownerType === undefined) {
                return true;
            }

            return this.$refs.ownerType.isUnknown(value);
        }
    }
};
</script>
