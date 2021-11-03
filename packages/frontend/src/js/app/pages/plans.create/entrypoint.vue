<template>
    <Guard>
        <Page />
    </Guard>
</template>

<script>
export default {
    components: {
        Page: () => import("./plans.create.vue")
    }
};
</script>
