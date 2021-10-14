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
        title: "Mentions légales -"
    },
    components: {
        Page: () => import("./legalMentions.vue")
    }
};
</script>
