<template>
    <div>
        <div class="ml-2">
            <Icon icon="user-circle" />
            <span class="text-dark font-bold"> Pilote <br /></span>
            <Button
                variant="text"
                :href="`/annuaire/${government_contact.organization.id}`"
                class="text-primary text-display-sm font-bold -mb-1 hover:underline"
            >
                {{ government_contact.organization.name }}
            </Button>
        </div>
    </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { Icon, Button } from "@resorptionbidonvilles/ui";

const props = defineProps({
    government_contact: {
        type: Object,
    },
});
const { government_contact } = toRefs(props);
</script>
