<template>
    <Guard>
        <PrivatePage />
    </Guard>
</template>

<script>
export default {
    components: {
        PrivatePage: () => import("./legalMentions.vue")
    }
};
</script>
