<template>
    <ClientOnly>
        <PrivatePage />
    </ClientOnly>
</template>

<script>
export default {
    components: {
        PrivatePage: () => import("./TownUpdate.vue")
    }
};
</script>
