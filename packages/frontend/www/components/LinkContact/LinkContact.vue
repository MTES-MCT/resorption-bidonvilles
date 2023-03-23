<template>
    <Link v-bind="$attrs" :to="href" @click="setWebappDevice">
    <slot />
    </Link>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import { useI18n } from 'vue-i18n';
import { Link } from "@resorptionbidonvilles/ui";
import setWebappDevice from "~~/utils/setWebappDevice";

const i18n = useI18n();
const props = defineProps({
    isDemandeAcces: {
        type: Boolean,
        default: false
    }
});
const { isDemandeAcces } = toRefs(props);

const { WEBAPP_URL } = useRuntimeConfig();
const href = computed(() => {
    const url = `${WEBAPP_URL}/contact?language=${i18n.locale.value}`;
    if (!isDemandeAcces.value || i18n.locale.value !== "fr") {
        return url;
    }

    return `${url}&acces`
});
</script>