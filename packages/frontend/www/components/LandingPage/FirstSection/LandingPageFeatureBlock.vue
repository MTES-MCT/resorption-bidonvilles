<template>
    <div>
        <Icon :icon="icon" size="3x" height="48"></Icon>
        <h3 class="text-display-lg mt-2"><slot /></h3>
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
