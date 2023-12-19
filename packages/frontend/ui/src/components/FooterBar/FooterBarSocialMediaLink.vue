<template>
    <a :href="href" class="inline-block p-2 hover:bg-blue200" :class="focusClasses.ring">
        <Icon :icon="`fa-brands ${icon}`" class="text-3xl text-primary"
            :title="`${socialVerb} ${socialOn} ${socialName}`" />
    </a>
</template>

<script setup>
import Icon from "../Icon.vue";
import focusClasses from '../../../../common/utils/focus_classes';

const props = defineProps({
    href: String,
    icon: String,
    socialVerb: String,
    socialName: String,
    socialOn: String,
});
</script>
