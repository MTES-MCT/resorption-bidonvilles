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
        PrivatePage: () => import("./TownUpdate.vue")
    }
};
</script>
