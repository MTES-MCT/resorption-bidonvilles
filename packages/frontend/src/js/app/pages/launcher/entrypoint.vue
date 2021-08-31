<template>
    <ClientOnly>
        <PrivatePage />
    </ClientOnly>
</template>

<script>
export default {
    components: {
        PrivatePage: () => import("./launcher.vue")
    }
};
</script>
