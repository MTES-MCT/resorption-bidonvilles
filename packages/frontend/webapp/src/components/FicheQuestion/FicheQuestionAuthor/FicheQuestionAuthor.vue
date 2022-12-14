<template>
    <article class="flex items-center">
        <aside class="self-start">
            <span
                :class="`bg-G200 mr-4 text-xl rounded-full inline-flex items-center justify-center w-12 h-12`"
            >
                <Icon icon="user" />
            </span>
        </aside>
        <section>
            <p>{{ author.first_name }} {{ author.last_name }}</p>
            <p class="italic text-G500">
                {{ author.organization }}
            </p>
        </section>
    </article>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    author: Object,
});
const { author } = toRefs(props);
</script>
