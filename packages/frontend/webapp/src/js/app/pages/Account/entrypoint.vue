<template>
    <Guard
        :ssr="$context && $context.ssr"
        :beforeEnter="$context && $context.beforeEnter"
        :meta="$context && $context.meta"
    >
        <Page
    /></Guard>
</template>

<script>
export default {
    components: {
        Page: () => import("./index.vue")
    }
};
</script>
