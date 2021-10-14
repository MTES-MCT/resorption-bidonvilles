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
    components: {
        Page: () => import("./covid.vue")
    }
};
</script>
