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
                v-if="!ownerTypeIsUnknown && hasOwnerPermission"
                v-model="input.owner"
            ></InputOwner>
        </FormParagraph>
        <FormParagraph
            title="S'agit-il d'une réinstallation ?"
            :showMandatoryStar="true"
            class="w-128"
        >
            La majorité des habitants était déjà sur le territoire.
            <TownFormClosedShantytowns
                :nearbyClosedShantytowns="nearbyClosedShantytowns"
            ></TownFormClosedShantytowns>
            <InputIsReinstallation
                v-model="input.is_reinstallation"
            ></InputIsReinstallation>
        </FormParagraph>
        <div class="ml-12 mt-6" v-if="input.is_reinstallation === 1">
            <InputReinstallationComments
                v-model="input.reinstallation_comments"
            ></InputReinstallationComments>
        </div>
    </FormGroup>
</template>

<script>
import { get as getConfig, hasPermission } from "#helpers/api/config";
import InputBuiltAt from "./inputs/InputBuiltAt.vue";
import InputDeclaredAt from "./inputs/InputDeclaredAt.vue";
import InputFieldType from "./inputs/InputFieldType.vue";
import InputDetailedAddress from "./inputs/InputDetailedAddress.vue";
import InputOwnerType from "./inputs/InputOwnerType.vue";
import InputOwner from "./inputs/InputOwner.vue";
import InputIsReinstallation from "./inputs/InputIsReinstallation.vue";
import InputReinstallationComments from "./inputs/InputReinstallationComments.vue";
import TownFormClosedShantytowns from "./TownFormClosedShantytowns.vue";

export default {
    components: {
        InputBuiltAt,
        InputDeclaredAt,
        InputFieldType,
        InputDetailedAddress,
        InputOwnerType,
        InputOwner,
        InputIsReinstallation,
        InputReinstallationComments,
        TownFormClosedShantytowns
    },

    props: {
        nearbyClosedShantytowns: {
            type: Array
        },
        value: {
            type: Object,
            required: true
        }
    },

    data() {
        const { owner_types } = getConfig();
        return {
            values: owner_types,
            isMounted: false,
            input: this.value
        };
    },

    computed: {
        ownerTypeIsUnknown() {
            if (
                this.input.owner_type === undefined ||
                this.input.owner_type < 1
            ) {
                return true;
            }

            return this.isUnknown(this.input.owner_type);
        }
    },

    methods: {
        isUnknown(value) {
            const label = this.getLabelFor(value);
            return label === undefined || label === "Inconnu";
        },

        hasOwnerPermission() {
            return hasPermission("shantytown_owner.access");
        },

        getLabelFor(ownerTypeId) {
            const value = this.values.find(({ id }) => id === ownerTypeId);
            if (value === undefined) {
                return undefined;
            }

            return value.label;
        }
    }
};
</script>
