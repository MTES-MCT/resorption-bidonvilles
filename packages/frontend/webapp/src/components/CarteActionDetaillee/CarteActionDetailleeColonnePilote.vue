<template>
    <div>
        <div class="ml-2">
            <Icon icon="user-circle" />
            <span class="text-dark font-bold">Pilote(s)</span><br />
            <p v-for="manager in managers" :key="manager.id">
                <LinkOrganization :to="`/structure/${manager.id}`">
                    {{ manager.abbreviation || manager.name }}
                </LinkOrganization>
            </p>
        </div>
    </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { Icon, LinkOrganization } from "@resorptionbidonvilles/ui";

const props = defineProps({
    managers: {
        type: Array,
    },
});
const { managers } = toRefs(props);
</script>
