<template>
    <div class="flex justify-between">
        <LinkOrganization :to="`/structure/${author.organization_id}`">
            {{ author.first_name }}
            {{ author.last_name }} -
            {{ author.organization }}
        </LinkOrganization>
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
