<template>
    <Guard>
        <Page />
    </Guard>
</template>

<script>
export default {
    components: {
        Page: () => import("./PlanMarks.vue")
    }
};
</script>
