<template>
    <Layout :stickyHeader="false" :displayLanguagePicker="false" >
        <slot />
    </Layout>
</template>

<script setup>
import Layout from "~/components/Layout/Layout.vue";
</script>