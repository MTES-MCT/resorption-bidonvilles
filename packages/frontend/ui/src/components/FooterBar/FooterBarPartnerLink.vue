<template>
    <a
        :href="href"
        class="text-sm text-G800 font-bold border-b-2 border-b-transparent hover:border-b-G800"
        :class="focusClasses.ring"
        ><slot
    /></a>
</template>

<script setup>
import { toRefs } from "vue";
import focusClasses from '../../../../common/utils/focus_classes';

const props = defineProps({
    href: String,
});

const { href } = toRefs(props);
</script>
