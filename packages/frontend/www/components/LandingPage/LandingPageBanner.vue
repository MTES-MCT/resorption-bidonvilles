<template>
    <div class="bg-orange300 text-secondary full-width text-center py-8">
        <Container>
            <div class="max-w-screen-md mx-auto">
                <p class="text-display-lg text-secondary font-bold">
                    <slot />
                </p>
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
