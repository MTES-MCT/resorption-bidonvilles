<template>
    <div class="flex justify-between">
        <div class="text-primary font-bold mb-1 mt-2">
            <LinkOrganization :to="`/structure/${author.organization_id}`">
                {{ author.first_name }}
                {{ author.last_name }} -
                {{ author.organization }}
            </LinkOrganization>
        </div>
    </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

import { LinkOrganization } from "@resorptionbidonvilles/ui";

const props = defineProps({
    author: Object,
});
const { author } = toRefs(props);
</script>
