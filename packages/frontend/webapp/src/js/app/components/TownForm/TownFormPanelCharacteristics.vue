<template>
    <FormGroup title="Caractéristiques du site">
        <FormParagraph
            title="Quelles sont les dates clés du site ?"
            class="w-128"
        >
            <div class="w-64">
                <InputBuiltAt
                    v-model="input.built_at"
                    :disableAfter="input.declared_at"
                ></InputBuiltAt>
                <InputDeclaredAt
                    v-model="input.declared_at"
                    :disableBefore="input.built_at"
                ></InputDeclaredAt>
            </div>

            <InputFieldType
                v-if="input.declared_at"
                v-model="input.field_type"
            ></InputFieldType>
            <InputDetailedAddress
                v-if="input.declared_at"
                v-model="input.detailed_address"
            ></InputDetailedAddress>
        </FormParagraph>

        <FormParagraph
            title="Quel est le propriétaire ?"
            v-if="input.declared_at"
            :showMandatoryStar="true"
            class="w-128"
        >
            <InputOwnerType
                v-model="input.owner_type"
                ref="ownerType"
            ></InputOwnerType>
            <InputOwner
                v-if="!ownerTypeIsUnknown && hasOwnerPermission"
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
        values() {
            return this.$store.state.config.configuration.owner_types;
        },
        ownerTypeIsUnknown() {
            return this.isUnknown(this.input.owner_type);
        }
    },

    methods: {
        isUnknown(value) {
            const label = this.getLabelFor(value);
            return label === undefined || label === "Inconnu";
        },

        hasOwnerPermission() {
            return this.$store.getters["config/hasPermission"](
                "shantytown_owner.access"
            );
        },

        getLabelFor(ownerTypeId) {
            const value = this.values.find(({ id }) => id === ownerTypeId);
            if (value === undefined) {
                return undefined;
            }

            return value.label;
        }
    },
    watch: {
        "input.declaredAt": async function() {
            this.$emit("declaredAtChanged", this.input.declaredAt);
        }
    }
};
</script>
