<template>
    <Button v-bind="$attrs" :href="href" @click="setWebappDevice">
        <slot />
    </Button>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import { Button } from "@resorptionbidonvilles/ui";
import setWebappDevice from "~~/utils/setWebappDevice";

const props = defineProps({
    isDemandeAcces: {
        type: Boolean,
        default: false
    }
});
const { isDemandeAcces } = toRefs(props);

const { WEBAPP_URL } = useRuntimeConfig();
const href = computed(() => {
    const url = `${WEBAPP_URL}/contact`;
    if (!isDemandeAcces.value) {
        return url;
    }

    return `${url}?acces`
});
</script>