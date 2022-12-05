<template>
    <p class="text-center">
        <Button
            icon="paper-plane"
            iconPosition="left"
            :disabled="disabled"
            :loading="loading"
            >Publier la note</Button
        >
    </p>
</template>

<script>
import { Button } from "@resorptionbidonvilles/ui";

export default {
    components: {
        Button,
    },

    props: {
        disabled: {
            type: Boolean,
            required: false,
            default: false,
        },
        loading: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
};
</script>
