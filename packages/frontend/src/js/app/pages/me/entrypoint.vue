<template>
    <Guard>
        <ClientOnly>
            <PrivatePage />
        </ClientOnly>
    </Guard>
</template>

<script>
export default {
    components: {
        PrivatePage: () => import("./me.vue")
    }
};
</script>
