<template>
    <button type="button" :class="[
        'border-b-2 pb-1 inline-block mr-8',
        focusClasses.ring,
        active
            ? 'text-primary font-bold border-primary'
            : 'cursor-pointer border-transparent'
    ]">
        <span v-if="$slots.ofwhich" class="mr-2 text-sm"><slot name="ofwhich" /></span>
        <span v-if="$slots.prefix" class="mr-1 rounded text-sm px-1 border" :class="[
            active ? 'border-transparent text-white bg-primary' : 'border-primary text-primary',
        ]"><slot name="prefix" /></span>
        <slot />
    </button>
</template>

<script setup>
import { toRefs } from "vue";
import focusClasses from '../../../../common/utils/focus_classes';

const props = defineProps({
    active: {
        type: Boolean
    }
});
const { active } = toRefs(props);
</script>
