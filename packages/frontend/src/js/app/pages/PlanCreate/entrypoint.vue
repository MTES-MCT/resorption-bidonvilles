<template>
    <Guard> <Page /></Guard>
</template>

<script>
export default {
    components: {
        Page: () => import("./PlanCreate.vue")
    }
};
</script>
