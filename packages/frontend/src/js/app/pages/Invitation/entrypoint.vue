<template>
    <Guard>
        <Page />
    </Guard>
</template>

<script>
export default {
    metaInfo: {
        title: "Invitation",
        titleTemplate: "%s - Résorption Bidonvilles"
    },
    components: {
        Page: () => import("./index.vue")
    }
};
</script>
