<template>
    <FormGroup title="Contacts">
        <InputContactGovernment v-model="input.government" />
        <InputContactAssociation v-model="input.association" />
        <InputContactAssociationActor
            v-if="input.association"
            v-model="input.contact"
            :associationId="input.association.id"
            :associationName="input.association.name"
            :associationDepartement="
                input.association.location.departement.code
            "
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
