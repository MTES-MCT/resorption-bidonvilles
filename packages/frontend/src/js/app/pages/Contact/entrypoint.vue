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
        title: "Contact -"
    },
    components: {
        Page: () => import("./index.vue")
    }
};
</script>
