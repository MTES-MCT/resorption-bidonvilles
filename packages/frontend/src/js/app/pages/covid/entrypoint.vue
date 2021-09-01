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
        PrivatePage: () => import("./covid.vue")
    }
};
</script>
