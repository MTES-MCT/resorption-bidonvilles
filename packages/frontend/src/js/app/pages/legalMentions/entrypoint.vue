<template>
    <Guard>
        <PrivatePage />
    </Guard>
</template>

<script>
export default {
    metaInfo: {
        title: "Mentions légales -"
    },
    components: {
        PrivatePage: () => import("./legalMentions.vue")
    }
};
</script>
