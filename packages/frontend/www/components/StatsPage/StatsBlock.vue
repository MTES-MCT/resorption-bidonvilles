<template>
    <div>
        <div class="text-display-lg font-bold">
            {{ title }}
            <span class="text-secondary"
                ><Icon v-if="icon" :icon="icon" height="32"
            /></span>
        </div>
        <div class="text-display-sm font-bold">{{ subtitle }}</div>
        <div class="text-sm">{{ info }}</div>
    </div>
</template>

<script>
import { Icon } from "@resorptionbidonvilles/ui";

export default {
    props: {
        title: {
            type: [String, Number],
            required: true
        },
        subtitle: {
            type: String,
            required: true
        },
        info: {
            type: String,
            required: false
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
