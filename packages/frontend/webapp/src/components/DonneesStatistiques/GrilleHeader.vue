<template>
    <div
        class="border-t border-b flex items-stretch justify-end py-3 cursor-pointer hover:bg-G100"
    >
        <div
            class="flex space-x-2 px-3 items-end"
            :class="separator ? 'border-r' : ''"
        >
            <p><slot /></p>
        </div>
    </div>
</template>

<script setup>
import { toRefs } from "vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    separator: {
        type: Boolean,
        default: true,
    },
});

const { separator } = toRefs(props);
</script>
