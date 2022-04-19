<template>
    <Guard>
        <Page />
    </Guard>
</template>

<script>
export default {
    metaInfo: {
        title: "Nouveau mot de passe",
        titleTemplate: "%s - Résorption Bidonvilles"
    },
    components: {
        Page: () => import("./index.vue")
    }
};
</script>
