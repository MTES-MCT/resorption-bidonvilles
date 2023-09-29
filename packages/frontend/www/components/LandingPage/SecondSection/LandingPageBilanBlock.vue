<template>
    <div class="flex flex-row">
        <p>
            <Icon :icon="icon" size="2x" height="32" class="text-secondary"></Icon>
        </p>
        <p class="ml-2">
            <span class="font-bold text-display-md">{{ text }}</span>
            <span class="pl-1">{{ info }}</span>
        </p>
    </div>
</template>

<script>
import { Icon } from "@resorptionbidonvilles/ui";

export default {
    components: {
        Icon
    },
    props: {
        icon: {
            required: true
        },
        text: {
            type: String,
            required: true
        },
        info: {
            type: String
        }
    }
};
</script>
