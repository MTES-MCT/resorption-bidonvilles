<template>
    <div class="bg-corail text-white full-width text-center py-8">
        <Container>
            <div class="max-w-screen-md mx-auto">
                <h2 class="text-display-lg text-white font-bold">
                    <slot />
                </h2>
                <div class="pt-4">
                    <Link :to="`${WEBAPP_URL}/contact`"><Button variant="primary">{{
                            cta
                    }}</Button></Link>
                </div>
            </div>
        </Container>
    </div>
</template>

<script setup>
import { defineProps, toRefs, computed, ref, onMounted, onUnmounted } from "vue";

import { Link, Button } from "@resorptionbidonvilles/ui";
import Container from "~/components/Layout/Container/Container.vue";

const { WEBAPP_URL } = useRuntimeConfig();

const props = defineProps({
    cta: {
        type: String,
        required: true
    }
});
const { cta } = toRefs(props);
</script>
