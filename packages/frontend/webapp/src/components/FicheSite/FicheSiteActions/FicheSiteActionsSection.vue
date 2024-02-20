<template>
    <section>
        <template v-if="actions.length > 0">
            <p v-if="$slots.title" class="text-primary text-lg">
                <slot name="title" />
            </p>
            <FicheSiteActionsGrille :actions="actions" />
        </template>
        <p v-else><slot name="empty" /></p>
    </section>
</template>

<script setup>
import { toRefs } from "vue";
import FicheSiteActionsGrille from "./FicheSiteActionsGrille.vue";

const props = defineProps({
    actions: {
        type: Array,
        required: true,
    },
});
const { actions } = toRefs(props);
</script>
