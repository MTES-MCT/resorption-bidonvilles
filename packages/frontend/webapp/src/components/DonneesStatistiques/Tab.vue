<template>
    <div
        class="cursor-pointer hover:bg-G100 inline-block bg-white px-3 font-bold border-t-2 text-sm align-bottom mr-2"
        :class="
            active
                ? 'py-2 text-primary border-primary'
                : 'pt-2 pb-1 border-blue200'
        "
    >
        <slot />
    </div>
</template>

<script setup>
import { toRefs } from "vue";
const props = defineProps({
    active: {
        type: Boolean,
        default: false,
    },
});

const { active } = toRefs(props);
</script>
