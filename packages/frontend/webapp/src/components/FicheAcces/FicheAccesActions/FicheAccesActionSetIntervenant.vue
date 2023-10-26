<template>
    <Button
        v-if="
            !user.is_admin &&
            user.role_id !== 'intervener' &&
            user.status !== 'inactive'
        "
        variant="primaryOutline"
        :loading="isLoading"
        :disabled="disabled"
        >Définir comme « Intervenant »
    </Button>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { Button } from "@resorptionbidonvilles/ui";

const props = defineProps({
    user: Object,
    isLoading: Boolean,
    disabled: Boolean,
});
const { user, isLoading, disabled } = toRefs(props);
</script>
