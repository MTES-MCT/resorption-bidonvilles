<template>
    <Layout hero>
        <FormConnexion :reason="reason" />
    </Layout>
</template>

<script setup>
import Layout from "@/components/Layout/Layout.vue";
import FormConnexion from "@/components/FormConnexion/FormConnexion.vue";
import { ref } from "vue";
import { useRoute } from "vue-router";

let reason = ref("");
const route = useRoute();
reason.value = route.query.reason ? route.query.reason : null;
</script>
