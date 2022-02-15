<template>
    <Guard>
        <Page />
    </Guard>
</template>

<script>
export default {
    components: {
        Page: () => import("./DashboardPOC.vue")
    }
};
</script>
