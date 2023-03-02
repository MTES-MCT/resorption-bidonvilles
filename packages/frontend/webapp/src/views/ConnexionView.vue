<template>
    <Layout hero>
        <FormConnexion :reason="reason" />
    </Layout>
</template>

<script setup>
import Layout from "@/components/Layout/Layout.vue";
import FormConnexion from "@/components/FormConnexion/FormConnexion.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";

const reason = computed(() => {
    const route = useRoute();
    return route.query?.reason || null;
});
</script>
