<template>
    <div class="flex items-center">
        <Icon :icon="icon" class="text-G400" />
        <div class="ml-2"><slot /></div>
    </div>
</template>

<script setup>
import { toRefs } from "vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    icon: String,
});
const { icon } = toRefs(props);
</script>
