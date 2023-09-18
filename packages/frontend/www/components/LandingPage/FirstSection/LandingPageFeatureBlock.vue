<template>
    <div>
        <Icon :icon="icon" size="3x" height="48"></Icon>
        <p class="text-display-lg mt-2">
            <slot />
        </p>
    </div>
</template>

<script>
import { Icon } from "@resorptionbidonvilles/ui";

export default {
    props: {
        icon: {
            type: String,
            required: true
        }
    },
    components: {
        Icon
    }
};
</script>
