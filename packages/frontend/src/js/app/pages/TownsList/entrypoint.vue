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
        PrivatePage: () => import("./TownsList.vue")
    }
};
</script>
