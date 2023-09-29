<template>
    <button type="button" :class="[
        'inline-block appearance-none h-3 w-3 mx-1 cursor-pointer rounded-full border-1 border-black outline-none',
        active && 'bg-black border-transparent'
    ]" :checked="active" @click="onClick">
        <span class="sr-only">{{ alt }}</span>
    </button>
</template>

<script setup>
const props = defineProps({
    alt: {
        type: [String, Array],
        required: true
    },
    active: {
        type: Boolean
    },
    onClick: {
        type: Function
    }
});
const { alt, active, onClick } = toRefs(props);
</script>
