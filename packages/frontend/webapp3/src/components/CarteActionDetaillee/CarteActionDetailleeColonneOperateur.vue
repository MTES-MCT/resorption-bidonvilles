<template>
    <div>
        <div class="ml-2">
            <Icon icon="user-circle" />
            <span class="text-dark font-bold"> Opérateur <br /></span>
            <Button
                variant="text"
                :href="`/annuaire/${operator_contact.organization.id}`"
                class="text-primary text-display-sm font-bold hover:underline -mb-1"
            >
                {{ operator_contact.organization.name }}
            </Button>
        </div>
    </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { Icon, Button } from "@resorptionbidonvilles/ui";

const props = defineProps({
    operator_contact: {
        type: Object,
    },
});
const { operator_contact } = toRefs(props);
</script>
