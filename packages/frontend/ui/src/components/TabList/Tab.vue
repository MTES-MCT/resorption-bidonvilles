<template>
    <button type="button" :class="[
        'border-b-2 pb-1 inline-block mr-8',
        focusClasses.ring,
        active
            ? 'text-primary font-bold border-primary'
            : 'cursor-pointer border-transparent'
    ]">
        <span v-if="$slots.ofwhich" class="mr-2 text-sm"><slot name="ofwhich" /></span>
        <DsfrTag small selectable :selected="active"><slot name="prefix" /></DsfrTag>
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
