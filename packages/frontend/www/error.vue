<template>
    <NuxtLayout>
        <Error :error="error" />
    </NuxtLayout>
</template>

<script setup>
import Error from "~/components/Error/Error.vue";

const error = useError();
</script>


