<template>
    <div class="flex items-stretch py-2 font-bold">
        <div
            class="flex px-6 items-center"
            :class="separator ? 'border-r' : ''"
        >
            <div :class="`pl-${pl}`"><slot /></div>
        </div>
    </div>
</template>

<script setup>
import { toRefs } from "vue";

const props = defineProps({
    separator: {
        type: Boolean,
        default: true,
    },
    pl: {
        type: Number,
        default: 3,
    },
});

const { separator, pl } = toRefs(props);
</script>
