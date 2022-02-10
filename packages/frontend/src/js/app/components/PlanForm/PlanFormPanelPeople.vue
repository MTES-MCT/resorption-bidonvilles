<template>
    <FormGroup title="Contacts">
        <InputContactGovernment v-model="input.government" />
        <InputContactAssociation
            v-model="input.association"
            :disabled="mode !== 'create'"
        />
        <InputContactAssociationActor
            v-if="input.association"
            v-model="input.contact"
            :associationId="input.association.id"
            :associationName="input.association.name"
            :associationDepartement="
                input.association.location.departement.code
            "
            :disabled="mode !== 'create'"
        />
    </FormGroup>
</template>

<script>
import InputContactGovernment from "./inputs/InputContactGovernment.vue";
import InputContactAssociation from "./inputs/InputContactAssociation.vue";
import InputContactAssociationActor from "./inputs/InputContactAssociationActor.vue";

export default {
    props: {
        value: {
            type: Object,
            required: true
        },
        mode: {
            type: String,
            required: true
        }
    },

    components: {
        InputContactGovernment,
        InputContactAssociation,
        InputContactAssociationActor
    },

    data() {
        return {
            input: this.value
        };
    }
};
</script>
