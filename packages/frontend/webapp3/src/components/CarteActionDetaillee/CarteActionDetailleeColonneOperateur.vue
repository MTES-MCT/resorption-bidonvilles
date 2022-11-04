<template>
    <div>
        <div class="ml-2">
            <Icon icon="user-circle" />
            <span class="text-dark font-bold"> Opérateur</span><br />
            <LinkOrganization
                :to="`/annuaire/${operator_contact.organization.id}`"
            >
                {{ operator_contact.organization.name }}
            </LinkOrganization>
        </div>
    </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { Icon, LinkOrganization } from "@resorptionbidonvilles/ui";

const props = defineProps({
    operator_contact: {
        type: Object,
    },
});
const { operator_contact } = toRefs(props);
</script>
