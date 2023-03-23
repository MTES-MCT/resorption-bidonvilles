<template>
    <div class="bg-corail text-white full-width text-center py-8">
        <Container>
            <div class="max-w-screen-md mx-auto">
                <h2 class="text-display-lg text-white font-bold">
                    <slot />
                </h2>
                <div class="pt-4">
                    <ButtonContact variant="primary" :isDemandeAcces="isDemandeAcces">{{
                        cta
                    }}</ButtonContact>
                </div>
            </div>
        </Container>
    </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

import ButtonContact from "~~/components/ButtonContact/ButtonContact.vue";
import Container from "~/components/Layout/Container/Container.vue";

const props = defineProps({
    cta: {
        type: String,
        required: true
    },
    isDemandeAcces: {
        type: Boolean,
        required: false,
        default: true,
    },
});
const { cta, isDemandeAcces } = toRefs(props);
</script>
