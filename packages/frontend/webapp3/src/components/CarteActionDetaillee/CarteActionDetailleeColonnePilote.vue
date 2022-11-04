<template>
    <div>
        <div class="ml-2">
            <Icon icon="user-circle" />
            <span class="text-dark font-bold"> Pilote</span><br />
            <LinkOrganization
                :to="`/annuaire/${government_contact.organization.id}`"
            >
                {{
                    government_contact.organization.abbreviation ||
                    government_contact.organization.name
                }}
            </LinkOrganization>
        </div>
    </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { Icon, LinkOrganization } from "@resorptionbidonvilles/ui";

const props = defineProps({
    government_contact: {
        type: Object,
    },
});
const { government_contact } = toRefs(props);
</script>
