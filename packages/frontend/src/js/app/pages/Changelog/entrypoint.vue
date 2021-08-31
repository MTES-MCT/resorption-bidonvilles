<template>
    <ClientOnly>
        <PrivatePage />
    </ClientOnly>
</template>

<script>
export default {
    components: {
        PrivatePage: () => import("./Changelog.vue")
    }
};
</script>
