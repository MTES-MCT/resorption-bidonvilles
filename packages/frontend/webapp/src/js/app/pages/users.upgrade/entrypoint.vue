<template>
    <Guard> <Page /></Guard>
</template>

<script>
export default {
    components: {
        Page: () => import("./users.upgrade.vue")
    }
};
</script>
