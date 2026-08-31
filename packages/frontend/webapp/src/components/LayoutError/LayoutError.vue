<template>
    <Layout v-bind="$attrs">
        <template v-slot:hero><slot name="hero" /></template>

        <ViewError :variant="variant">
            <template v-slot:title><slot name="title" /></template>
            <template v-slot:code><slot name="code" /></template>
            <template v-slot:content><slot name="content" /></template>
            <template v-slot:actions><slot name="actions" /></template>
        </ViewError>
    </Layout>
</template>

<script setup>
import { toRefs } from "vue";
import Layout from "@/components/Layout/Layout.vue";
import ViewError from "@/components/ViewError/ViewError.vue";

const props = defineProps({
    variant: {
        type: String, // valeurs possibles : "erreur", "interdit"
        required: false,
        default: "erreur",
    },
});
const { variant } = toRefs(props);
</script>
