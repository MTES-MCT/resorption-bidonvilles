<template>
    <ClientOnly>
        <PrivatePage />
    </ClientOnly>
</template>

<script>
export default {
    components: {
        PrivatePage: () => import("./me.vue")
    }
};
</script>
