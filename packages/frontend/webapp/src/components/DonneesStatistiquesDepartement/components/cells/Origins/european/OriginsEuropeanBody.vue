<template>
    <Icon
        v-if="town.origins.includes('european')"
        icon="check"
        class="text-success"
    />
</template>

<script setup>
import { toRefs } from "vue";

import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({ town: Object });
const { town } = toRefs(props);
</script>
