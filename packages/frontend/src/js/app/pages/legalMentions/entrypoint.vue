<template>
    <Guard
        :ssr="$context && $context.ssr"
        :beforeEnter="$context && $context.beforeEnter"
    >
        <Page />
    </Guard>
</template>

<script>
export default {
    metaInfo: {
        title: "Mentions légales",
        titleTemplate: "%s - Résorption Bidonvilles"
    },
    components: {
        Page: () => import("./legalMentions.vue")
    }
};
</script>
