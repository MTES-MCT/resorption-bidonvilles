<template>
    <div class="flex flex-row">
        <div>
            <Icon
                :icon="icon"
                size="2x"
                height="32"
                class="text-secondary"
            ></Icon>
        </div>
        <div class="ml-2">
            <span class="font-bold text-display-md">{{ text }}</span>
            <span class="pl-1">{{ info }}</span>
        </div>
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
