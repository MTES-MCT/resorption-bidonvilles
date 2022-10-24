<template>
    <Layout v-bind="$attrs">
        <template v-slot:hero><slot name="hero" /></template>
        <Loading class="py-48" />
    </Layout>
</template>

<script setup>
import Layout from "@/components/Layout/Layout.vue";
import Loading from "@/components/Loading/Loading.vue";
</script>
