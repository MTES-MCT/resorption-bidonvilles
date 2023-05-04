<template>
    <div class="flex items-stretch justify-end py-2 font-bold text-sm">
        <div
            class="flex px-3 items-center"
            :class="separator ? 'border-r' : ''"
        >
            <div>
                <div class="bg-red200 h-6 w-20"></div>
                <p class="text-lg"><slot /></p>
            </div>
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
