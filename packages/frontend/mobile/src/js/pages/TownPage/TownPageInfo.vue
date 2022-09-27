<template>
    <div
        class="grid grid-cols-2 py-4 justify-items-center border-t-1 border-G200"
    >
        <div class="font-bold justify-self-start">
            <Icon v-if="icon" :icon="icon" />
            {{ title }}
        </div>
        <slot />
    </div>
</template>

<script>
import { Icon } from "@resorptionbidonvilles/ui";

export default {
    props: {
        title: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            required: false
        }
    },
    components: {
        Icon
    }
};
</script>
