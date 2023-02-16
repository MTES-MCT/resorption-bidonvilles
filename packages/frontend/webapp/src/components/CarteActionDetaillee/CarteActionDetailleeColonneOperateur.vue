<template>
    <div>
        <div class="ml-2">
            <Icon icon="user-circle" class="mr-1" />
            <span class="text-dark font-bold">Opérateur(s)</span><br />
            <p v-for="operator in operators" :key="operator.id">
                <LinkOrganization :to="`/structure/${operator.id}`">
                    {{ operator.abbreviation || operator.name }}
                </LinkOrganization>
            </p>
        </div>
    </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { Icon, LinkOrganization } from "@resorptionbidonvilles/ui";

const props = defineProps({
    operators: {
        type: Array,
    },
});
const { operators } = toRefs(props);
</script>
