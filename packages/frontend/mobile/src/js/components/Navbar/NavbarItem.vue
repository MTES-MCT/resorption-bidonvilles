<template>
    <p class="flex flex-col items-center">
        <span class="text-lg pb-1"><Icon :icon="icon" /></span>
        <span>{{ label }}</span>
    </p>
</template>

<script>
import { Icon } from "@resorptionbidonvilles/ui";

export default {
    components: {
        Icon,
    },
    props: {
        icon: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            required: true,
        },
    },
};
</script>
