<template>
    <div class="min-h-[76px] font-bold text-sm">
        <div
            class="flex h-full w-full flex-col"
            :class="separator ? 'border-r' : ''"
        >
            <div class="flex h-6 w-full items-center justify-center px-2">
                <slot name="evolution" />
            </div>
            <p
                class="flex min-h-0 w-full flex-1 items-center justify-center text-center text-lg"
            >
                <slot name="figure" />
            </p>
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
});

const { separator } = toRefs(props);
</script>
