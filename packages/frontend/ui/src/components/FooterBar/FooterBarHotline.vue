<template>
    <section class="max-w-md mt-8 lg:mt-0">
        <h1 class="font-bold text-lg">{{ $t('footer.contactTitle') }}</h1>
        <p class="text-sm">{{ $t('footer.contactBody1') }}</p>
        <p class="text-sm">
            {{ $t('footer.contactBody2') }}
            <Link :to="`mailto:${CONTACT_EMAIL}`">{{
                CONTACT_EMAIL
            }}</Link>
        </p>
    </section>
</template>

<script setup>
import { toRefs } from "vue";
import Link from "../Link.vue";

const props = defineProps({
    CONTACT_EMAIL: String,
});
const { CONTACT_EMAIL } = toRefs(props);
</script>
