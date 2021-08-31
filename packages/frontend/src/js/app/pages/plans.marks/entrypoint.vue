<template>
    <ClientOnly>
        <PrivatePage />
    </ClientOnly>
</template>

<script>
export default {
    components: {
        PrivatePage: () => import("./plans.marks.vue")
    }
};
</script>
